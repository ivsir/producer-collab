require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { memoryStorage } = multer;
const {
  getAllUserImageKeysAndPresignedUrls,
  getUserPresignedUrls,
  uploadToS3,
} = require('./s3');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const dbConnection = require('./config/connection');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const AWS = require('aws-sdk');
const path = require('path');
// const { fileURLToPath } = require('url');
// const { dirname } = require('path');

// const __filename = fileURLToPath(__filename);
// const __dirname = dirname(__filename);

const app = express();
const port = Number.parseInt(process.env.PORT) || 3001;
console.log("port Number", port);

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

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  dbConnection.once("open", () => {
    app.listen(port, () => {
      console.log(`API server running on port ${port}!`);
      console.log(`Use GraphQL at http://localhost:${port}${server.graphqlPath}`);
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
    const folderKey = `${userId}/`;
    await s3.putObject({
      Bucket: bucketName,
      Key: folderKey,
      Body: "", // Empty body to represent a folder
    }).promise();

    res.status(200).json({ message: "S3 folder created successfully" });
  } catch (error) {
    console.error("Error creating S3 folder:", error);
    res.status(500).json({ error: "Failed to create S3 folder" });
  }
});

app.get("/user-folders", async (req, res) => {
  s3.listObjectsV2({ Bucket: bucketName }, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to retrieve objects from S3" });
    }

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
  const userId = req.headers["x-project-author"];

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
    presignedUrls = await getUserPresignedUrls(userId, "image");
  } else if (fileType === "audio") {
    presignedUrls = await getUserPresignedUrls(userId, "audio");
  }

  if (presignedUrls.error) {
    return res.status(400).json({ message: presignedUrls.error.message });
  }

  return res.json(presignedUrls);
});

startApolloServer();
