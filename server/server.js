const dotenv = require('dotenv');

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const serverless = require('serverless-http');
const { getAllUserImageKeysAndPresignedUrls, getUserPresignedUrls, uploadToS3 } = require("./s3.js");
// const { ApolloServer } = require("apollo-server-express");
const { ApolloServer } = require("apollo-server-lambda");
const { authMiddleware } = require("./utils/auth.js");
const dbConnection = require("./config/connection.js");
const typeDefs = require("./schemas/typeDefs.js");
const resolvers = require("./schemas/resolvers.js");
const AWS = require("aws-sdk");
const path = require("path");
const connectToDatabase = require("./config/connection.js");

const app = express();

const port = Number.parseInt(process.env.PORT) || 3001;
console.log("port Number", port);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const audioStorage = multer.memoryStorage();
const audioUpload = multer({ storage: audioStorage });
const customGraphQLEndpoint = '/graphql-api';



const s3 = new AWS.S3();
const bucketName = "react-image-upload-ivsir"; // Replace with your actual S3 bucket name

dotenv.config();
const corsOptions = {
  origin: ["https://main.dan6kz7trfabu.amplifyapp.com"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-file-type", "x-project-author"], // Allow specified headers
};
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: "*", // Allow requests from all origins (replace with your specific origins)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-file-type", "x-project-author"], // Allow specified headers
}));
// app.use(cors());
// app.use(cors(corsOptions));

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
      return res.status(500).json({ error: "Failed to retrieve objects from S3" });
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
    presignedUrls = await getUserPresignedUrls(userId, "image"); // Pass "image" as the file type
  } else if (fileType === "audio") {
    presignedUrls = await getUserPresignedUrls(userId, "audio"); // Pass "audio" as the file type
  }

  if (presignedUrls.error) {
    return res.status(400).json({ message: presignedUrls.error.message });
  }

  return res.json(presignedUrls);
});


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context }) => {
    // Ensure database connection is established
    await connectToDatabase();
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      user: context.user || null, // Add user from context if necessary
    };
  },
  // context: authMiddleware,
});

// const startServer = async () => {
//   await connectToDatabase();
//   await server.start();
//   server.applyMiddleware({ app, path: customGraphQLEndpoint });

//   app.listen(port, () => {
//     console.log(`API server running on port ${port}!`);
//     console.log(`Use GraphQL at http://localhost:${port}${server.graphqlPath}`);
//   });
// };
// Apply Apollo Server Lambda handler to the path
// app.use(customGraphQLEndpoint, server.createHandler());

// const startServer = async () => {
//   await dbConnection();
// };

// startServer();
// module.exports.handler = serverless(app);

exports.graphqlHandler = server.createHandler({
  cors: {
      origin: '*',
      credentials: true,
      allowedHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token', 'x-user-id', 'x-file-type', 'x-project-author'],
  },
});

module.exports.restHandler = serverless(app);