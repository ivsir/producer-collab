import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import {
  getAllUserImageKeysAndPresignedUrls,
  getUserPresignedUrls,
  uploadToS3,
} from "./s3.mjs";
import { ApolloServer } from "apollo-server-express";
// import { ApolloServer } from "@apollo/server";
import { authMiddleware } from "./utils/auth.mjs";
import dbConnection from "./config/connection.mjs";
import typeDefs from "./schemas/typeDefs.mjs";
import resolvers from "./schemas/resolvers.mjs";
import AWS from "aws-sdk";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Now you can use typeDefs, schema1Resolvers, schema2TypeDefs, and resolvers in your code.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// const port = Number.parseInt(process.env.PORT) || 3001;
const PORT = process.env.PORT || 3001;
console.log("port Number", PORT)

const storage = memoryStorage();
const upload = multer({ storage });

const audioStorage = multer.memoryStorage();
const audioUpload = multer({ storage: audioStorage });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
const s3 = new AWS.S3();
const bucketName = "react-image-upload-ivsir"; // Replace with your actual S3 bucket name
// Create a new instance of an Apollo server with the GraphQL schema

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

}

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  // server.applyMiddleware({ app, path: '/graphql' }); // Explicitly set the path

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  dbConnection.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on PORT ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: "*", // Allow requests from all origins (replace with your specific origins)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-file-type", "x-project-author"], // Allow specified headers
}));
// Define your routes for image upload and retrieval here
app.post("/create-s3-folder", async (req, res) => {
  const { userId } = req.body;

  try {
    // Initialize AWS S3

    // Specify the existing S3 bucket name where you want to create the folder

    // Specify the folder key (object key ending with a trailing slash)
    const folderKey = `${userId}/`;
    await s3
      .putObject({
        Bucket: bucketName,
        Key: folderKey,
        Body: "", // Empty body to represent a folder
      })
      .promise();

    res.status(200).json({ message: "S3 folder created successfully" });
  } catch (error) {
    console.error("Error creating S3 folder:", error);
    res.status(500).json({ error: "Failed to create S3 folder" });
  }
});

app.get("/user-folders", async (req, res) => {
  // Use the listObjectsV2 method to get a list of objects in the bucket
  s3.listObjectsV2({ Bucket: bucketName }, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve objects from S3" });
    }

    // The list of objects is in data.Contents
    const objects = data.Contents.map((object) => ({
      key: object.Key,
      lastModified: object.LastModified,
      size: object.Size,
    }));

    res.json(objects);
  });
});

app.post("/images", upload.single("image"), async (req, res) => {
  const { file } = req;

  const userId = req.headers["x-user-id"];

  if (!file || !userId) return res.status(400).json({ message: "Bad request" });

  const { key, error } = await uploadToS3({ file, userId });

  if (error) return res.status(500).json({ message: error.message });

  return res.status(201).json({ key });
});

app.post("/audiofiles", audioUpload.single("audio"), async (req, res) => {
  const { file } = req;

  const userId = req.headers["x-user-id"];

  if (!file || !userId) return res.status(400).json({ message: "Bad request" });

  const { key, error } = await uploadToS3({ file, userId });

  if (error) return res.status(500).json({ message: error.message });

  return res.status(201).json({ key });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];
  const fileType = req.headers["x-file-type"]; // "image" or "audio"

  if (!file || !userId || !fileType) {
    return res.status(400).json({ message: "Bad request" });
  }

  const { key, error } = await uploadToS3({ file, userId });

  if (error) return res.status(500).json({ message: error.message });

  return res.status(201).json({ key });
});

app.get("/images", async (req, res) => {

  const userId = req.headers["x-user-id"];

  if (!userId) return res.status(400).json({ message: "Bad request" });

  const { error, presignedUrls } = await getUserPresignedUrls(userId);
  if (error) return res.status(400).json({ message: error.message });

  return res.json(presignedUrls);
});

app.get("/audiofiles", async (req, res) => {
  // const userId = req.headers["x-user-id"];
  const userId = req.headers["x-project-author"]

  if (!userId) return res.status(400).json({ message: "Bad request" });

  const { error, presignedUrls } = await getUserPresignedUrls(userId);
  if (error) return res.status(400).json({ message: error.message });

  return res.json(presignedUrls);
});

app.get("/singlepost-image", async (req, res) => {
  const projectAuthor = req.headers["x-project-author"];

  if (!projectAuthor) return res.status(400).json({ message: "Bad request" });

  const { error, presignedUrls } = await getUserPresignedUrls(projectAuthor);
  if (error) return res.status(400).json({ message: error.message });

  return res.json(presignedUrls);
});

app.get("/files", async (req, res) => {
  const userId = req.headers["x-project-author"];
  const fileType = req.headers["x-file-type"]; // "image" or "audio"

  if (!userId || !fileType) {
    return res.status(400).json({ message: "Bad request" });
  }

  let presignedUrls;
  if (fileType === "image") {
    presignedUrls = await getUserPresignedUrls(userId, "image"); // Pass "image" as the file type
  } else if (fileType === "audio") {
    presignedUrls = await getUserPresignedUrls(userId, "audio"); // Pass "audio" as the file type
  }

  if (presignedUrls.error) {
    return res.status(400).json({ message: presignedUrls.error.message });
  }

  return res.json(presignedUrls);
});

startApolloServer(typeDefs, resolvers);
