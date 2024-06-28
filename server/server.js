const dotenv = require("dotenv");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const serverless = require("serverless-http");
const {
  getAllUserImageKeysAndPresignedUrls,
  getUserPresignedUrls,
  uploadToS3,
  parseForm,
} = require("./s3.js");
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
const customGraphQLEndpoint = "/graphql-api";
const corsOptions = {
  origin: "https://main.dan6kz7trfabu.amplifyapp.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-user-id",
    "x-file-type",
    "x-project-author",
  ],
  credentials: false,
};

const s3 = new AWS.S3();
const bucketName = "react-image-upload-ivsir"; // Replace with your actual S3 bucket name

dotenv.config();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.options("*", cors(corsOptions)); // Handle pre-flight requests

// Define the OPTIONS middleware

// app.use(cors({
//   origin: "*", // Allow requests from all origins (replace with your specific origins)
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified HTTP methods
//   allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-file-type", "x-project-author"], // Allow specified headers
// }));
// app.use(cors({
//   origin: 'https://main.dan6kz7trfabu.amplifyapp.com',
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-file-type', 'x-project-author'],
//   // Additional options if needed
// }));

// app.use(handleOptionsRequest)

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

    // Call authMiddleware to set the user
    const user = authMiddleware(event);

    // Log the context to debug
    console.log('Context before returning:', {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      user,
    });

    // Return the context with the user attached
    return {
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      user,
    };
  },
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "X-Amz-Date",
      "Authorization",
      "X-Api-Key",
      "X-Amz-Security-Token",
      "x-user-id",
      "x-file-type",
      "x-project-author",
    ],
  },
});

exports.createS3FolderHandler = async (event, context, callback) => {
  const { userId } = JSON.parse(event.body);

  try {
    const folderKey = `${userId}/`;
    await s3
      .putObject({
        Bucket: bucketName,
        Key: folderKey,
        Body: "", // Empty body to represent a folder
      })
      .promise();

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
          ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "S3 folder created successfully" }),
    };
    callback(null, response);
  } catch (error) {
    console.error("Error creating S3 folder:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create S3 folder" }),
    };
    callback(null, response);
  }
};

exports.getUserFoldersHandler = async (event, context, callback) => {
  try {
    const data = await s3.listObjectsV2({ Bucket: bucketName }).promise();
    const objects = data.Contents.map((object) => ({
      key: object.Key,
      lastModified: object.LastModified,
      size: object.Size,
    }));

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(objects),
    };
    callback(null, response);
  } catch (error) {
    console.error("Failed to retrieve objects from S3:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve objects from S3" }),
    };
    callback(null, response);
  }
};

exports.uploadHandler = async (event, context, callback) => {
  const { file } = JSON.parse(event.body);
  const userId = event.headers["x-user-id"];
  const fileType = event.headers["x-file-type"];

  if (!file || !userId || !fileType) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad request" }),
    };
    callback(null, response);
    return;
  }

  try {
    const { key, error } = await uploadToS3({ file, userId });

    if (error) {
      const response = {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ key }),
    };
    callback(null, response);
  } catch (error) {
    console.error("Error processing upload:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
    callback(null, response);
  }
};

// exports.singlePostImageHandler = async (event, context, callback) => {
//   try {
//     const projectAuthor = event.headers["x-project-author"];

//     if (!projectAuthor) {
//       const response = {
//         statusCode: 400,
//         body: JSON.stringify({ message: "Bad request" }),
//       };
//       callback(null, response);
//       return;
//     }

//     const { error, presignedUrls } = await getUserPresignedUrls(projectAuthor);

//     if (error) {
//       const response = {
//         statusCode: 400,
//         body: JSON.stringify({ message: error.message }),
//       };
//       callback(null, response);
//       return;
//     }

//     const response = {
//       statusCode: 200,
//       headers: {
//         "Access-Control-Allow-Origin":
//         ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
//         "Access-Control-Allow-Credentials": true,
//       },
//       body: JSON.stringify(presignedUrls),
//     };
//     callback(null, response);
//   } catch (error) {
//     console.error("Error processing request:", error);
//     const response = {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal server error" }),
//     };
//     callback(null, response);
//   }
// };


let cachedPresignedUrls;

exports.singlePostImageHandler = async (event, context, callback) => {
  try {
    const projectAuthor = event.headers["x-project-author"];

    if (!projectAuthor) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad request" }),
      };
      callback(null, response);
      return;
    }

    // Check if cached data exists and is recent enough
    if (cachedPresignedUrls) {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": event.headers.origin || allowedOrigins[0], // Adjust as per your CORS setup
        },
        body: JSON.stringify(cachedPresignedUrls),
      };
      callback(null, response);
      return;
    }

    const { error, presignedUrls } = await getUserPresignedUrls(projectAuthor);

    if (error) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: error.message }),
      };
      callback(null, response);
      return;
    }

    cachedPresignedUrls = presignedUrls; // Update cache with fresh data

    const allowedOrigins = [
      'https://main.dan6kz7trfabu.amplifyapp.com',
      'http://localhost:3000'
    ];

    const origin = event.headers.origin;
    const responseHeaders = {
      "Access-Control-Allow-Credentials": true,
    };

    if (allowedOrigins.includes(origin)) {
      responseHeaders["Access-Control-Allow-Origin"] = origin;
    }

    const response = {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(presignedUrls),
    };
    callback(null, response);
  } catch (error) {
    console.error("Error processing request:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
    callback(null, response);
  }
};

// exports.singlePostImageHandler = async (event, context, callback) => {
//   try {
//     const projectAuthor = event.headers["x-project-author"];

//     if (!projectAuthor) {
//       const response = {
//         statusCode: 400,
//         body: JSON.stringify({ message: "Bad request" }),
//       };
//       callback(null, response);
//       return;
//     }

//     const { error, presignedUrls } = await getUserPresignedUrls(projectAuthor);

//     if (error) {
//       const response = {
//         statusCode: 400,
//         body: JSON.stringify({ message: error.message }),
//       };
//       callback(null, response);
//       return;
//     }

//     const allowedOrigins = [
//       'https://main.dan6kz7trfabu.amplifyapp.com',
//       'http://localhost:3000'
//     ];

//     const origin = event.headers.origin;
//     const responseHeaders = {
//       "Access-Control-Allow-Credentials": true,
//     };

//     if (allowedOrigins.includes(origin)) {
//       responseHeaders["Access-Control-Allow-Origin"] = origin;
//     }

//     const response = {
//       statusCode: 200,
//       headers: responseHeaders,
//       body: JSON.stringify(presignedUrls),
//     };
//     callback(null, response);
//   } catch (error) {
//     console.error("Error processing request:", error);
//     const response = {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal server error" }),
//     };
//     callback(null, response);
//   }
// };



exports.getImagesHandler = async (event, context, callback) => {
  const userId = event.headers["x-user-id"];

  if (!userId) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad request" }),
    };
    callback(null, response);
    return;
  }

  try {
    const { error, presignedUrls } = await getUserPresignedUrls(userId);

    if (error) {
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin":
          ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: error.message }),
      };
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(presignedUrls),
    };
    callback(null, response);
  } catch (error) {
    console.error("Error getting images:", error);
    const response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
    callback(null, response);
  }
};

exports.getAudioFilesHandler = async (event, context, callback) => {
  const userId = event.headers["x-project-author"];

  if (!userId) {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Bad request" }),
    };
    callback(null, response);
    return;
  }

  try {
    const { error, presignedUrls } = await getUserPresignedUrls(userId);

    if (error) {
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin":
          ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: error.message }),
      };
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(presignedUrls),
    };
    callback(null, response);
  } catch (error) {
    console.error("Error processing request:", error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
    callback(null, response);
  }
};

exports.getFilesHandler = async (event, context, callback) => {
  try {
    const userId = event.headers["x-project-author"];
    const fileType = event.headers["x-file-type"];

    if (!userId || !fileType) {
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin":
          ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Bad request" }),
      };
      callback(null, response);
      return;
    }

    let presignedUrls;
    if (fileType === "image") {
      presignedUrls = await getUserPresignedUrls(userId, "image");
    } else if (fileType === "audio") {
      presignedUrls = await getUserPresignedUrls(userId, "audio");
    }

    if (presignedUrls.error) {
      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: presignedUrls.error.message }),
      };
      callback(null, response);
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(presignedUrls),
    };
    callback(null, response);
  } catch (error) {
    console.error("Error processing request:", error);
    const response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin":
        ["https://main.dan6kz7trfabu.amplifyapp.com","http://locahost:3000"],
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
    callback(null, response);
  }
};


const handleUpload = async (event, callback, type) => {
  const allowedOrigins = [
    'https://main.dan6kz7trfabu.amplifyapp.com',
    'http://localhost:3000'
  ];

  try {
    const userId = event.headers['x-user-id'];

    if (!userId) {
      console.error('Missing user ID');
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad request: Missing user ID' })
      });
    }

    const headers = { ...event.headers };
    if (!headers['content-type'] && headers['Content-Type']) {
      headers['content-type'] = headers['Content-Type'];
    }

    const result = await parseForm(event, headers);
    // const result = await parseForm(event);


    if (!result.files || result.files.length === 0) {
      console.error(`No ${type} uploaded`);
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify({ message: `Bad request: No ${type} uploaded` })
      });
    }

    const { buffer, filename, mimetype } = result.files[0];
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} received:`, filename, 'User ID:', userId);

    const { key, error } = await uploadToS3({ file: { buffer, mimetype }, userId });

    if (error) {
      console.error(`Error uploading ${type} to S3:`, error);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({ message: error.message })
      });
    }

    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully. S3 key:, key`);

    const origin = event.headers.origin;
    const responseHeaders = {
      'Access-Control-Allow-Credentials': true,
    };

    if (allowedOrigins.includes(origin)) {
      responseHeaders['Access-Control-Allow-Origin'] = origin;
    }

    const response = {
      statusCode: 201,
      headers: responseHeaders,
      body: JSON.stringify({ key })
    };
    callback(null, response);
  } catch (error) {
    console.error(`Failed to upload ${type}:`, error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
    callback(null, response);
  }
};

exports.uploadImageHandler = async (event, context, callback) => {
  await handleUpload(event, callback, 'image');
};

exports.uploadAudioHandler = async (event, context, callback) => {
  await handleUpload(event, callback, 'audio');
};