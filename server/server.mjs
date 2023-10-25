import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import { getUserPresignedUrls, uploadToS3 } from "./s3.mjs";
import { ApolloServer } from "apollo-server-express";
import { authMiddleware } from "./utils/auth.mjs";
import dbConnection from "./config/connection.mjs";
import typeDefs from "./schemas/typeDefs.mjs";
import resolvers from "./schemas/resolvers.mjs";
import AWS from "aws-sdk";
import path from "path";
import Project from "./models/Project.mjs";
import User from "./models/User.mjs";
// Now you can use typeDefs, schema1Resolvers, schema2TypeDefs, and resolvers in your code.

const app = express();

const PORT = process.env.PORT || 3001;

const storage = memoryStorage();
const upload = multer({ storage });
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
const s3 = new AWS.S3();
const bucketName = "react-image-upload-ivsir"; // Replace with your actual S3 bucket name
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  dbConnection.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Define your routes for image upload and retrieval here
app.post("/create-s3-folder", async (req, res) => {
  const { userId } = req.body;

  try {
    // Initialize AWS S3

    // Specify the existing S3 bucket name where you want to create the folder

    // Specify the folder key (object key ending with a trailing slash)
    // const folderKey = `${userId}/${folderName}/`;
    const folderKey = `${userId}/`;
    // Create a dummy object to represent the folder
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
      return res.status(500).json({ error: 'Failed to retrieve objects from S3' });
    }

    // The list of objects is in data.Contents
    const objects = data.Contents.map((object) => ({
      key: object.Key,
      lastModified: object.LastModified,
      size: object.Size,
    }));
    console.log("object key",objects)

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

app.get("/images", async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) return res.status(400).json({ message: "Bad request" });

  const { error, presignedUrls } = await getUserPresignedUrls(userId);
  if (error) return res.status(400).json({ message: error.message });

  return res.json(presignedUrls);
});

app.get("/all-user-images", async (req, res) => {
  try {
    const users = await User.find(); // Assuming you have a User model
    // console.log(users);
    const allUserImages = await Promise.all(
      users.map(async (user) => {
        const { imageUrls, error } = await getUserImageKeysAndPresignedUrls(
          user._id
        ); // Assuming user._id is the user identifier
        console.log(imageUrls);
        if (error) {
          console.error(`Error for user ${user._id}:`, error);
          return null; // Handle the error
        }

        return { userId: user._id, images: imageUrls };
      })
    );

    // console.log(allUserImages);

    // Filter out users with errors, if needed
    const validUserImages = allUserImages.filter(
      (userImages) => userImages !== null
    );

    // console.log(validUserImages)

    return res.json(validUserImages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve user images" });
  }
});

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
