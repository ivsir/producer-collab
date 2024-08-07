require("dotenv").config();
const {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const Busboy = require("busboy")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuid } = require("uuid");
const s3 = new S3Client();
const BUCKET = process.env.BUCKET || "react-image-upload-ivsir";


const uploadToS3 = async ({ file, userId }) => {
  console.log(file)
  const key = `${userId}/${uuid()}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    return { key };
  } catch (error) {
    console.error("S3 upload error:", error);
    return { error };
  }
};

const parseForm = (event, headers) => {
  return new Promise((resolve, reject) => {
    const bb = new Busboy({ headers });
    const result = { files: [] };
    console.log(bb)

    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const buffers = [];
      file.on('data', (data) => {
        buffers.push(data);
      });
      file.on('end', () => {
        result.files.push({
          fieldname,
          buffer: Buffer.concat(buffers),
          filename,
          encoding,
          mimetype,
        });
      });
    });

    bb.on('field', (fieldname, value) => {
      console.log(`Field event: fieldname=${fieldname}, value=${value}`);
      result[fieldname] = value;
    });

    bb.on('finish', () => {
      console.log('Busboy finish event');
      resolve(result);
    });

    bb.on('error', (error) => {
      console.error('Busboy error event:', error);
      reject(error);
    });

    console.log('Writing body to Busboy');
    bb.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    bb.end();
  });
};



const getImageKeysByUser = async (userId) => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: userId,
  });

  const { Contents = [] } = await s3.send(command);

  return Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
  ).map((image) => image.Key);
};

const getUserPresignedUrls = async (userId) => {
  try {
    const imageKeys = await getImageKeysByUser(userId);

    const presignedUrls = await Promise.all(
      imageKeys.map((key) => {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        return getSignedUrl(s3, command, { expiresIn: 900 }); // default 15 minutes
      })
    );
    return { presignedUrls };
  } catch (error) {
    console.error(error);
    return { error };
  }
};


const getPresignedUrls = async (userId) => {
  try {
    const imageKeys = await getImageKeysByUser(userId);

    const signedUrls = await Promise.all(
      imageKeys.map((key) => {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        return getSignedUrl(s3, command); // default
      })
    );
    return { signedUrls };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

const getAllUserIds = async () => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
  });

  const { Contents = [] } = await s3.send(command);

  // Extract user IDs from the object keys
  const userIds = [
    ...new Set(Contents.map((image) => image.Key.split("/")[0])),
  ];

  return userIds;
};

const getImageKeysFromFolders = async (folderNames) => {
  const allImageKeys = [];

  for (const folderName of folderNames) {
    const prefix = `${folderName}/`; // The prefix of the folder

    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    });

    const { Contents = [] } = await s3.send(command);

    // Extract image keys from the objects in the folder
    const imageKeys = Contents.map((image) => image.Key);

    allImageKeys.push(...imageKeys);
  }

  return allImageKeys;
};

const getAllUserImageKeysAndPresignedUrls = async () => {
  try {
    const allUserIds = await getAllUserIds();
    const allImageKeys = await getImageKeysFromFolders(allUserIds);
    const presignedUrls = await Promise.all(
      allImageKeys.map((key) => {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const presignedUrl = getSignedUrl(s3, command, { expiresIn: 900 });
        return { key, presignedUrl };
      })
    );

    return { imageUrls: presignedUrls };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

module.exports = {
  uploadToS3,
  parseForm,
  getImageKeysByUser,
  getUserPresignedUrls,
  getPresignedUrls,
  getAllUserIds,
  getImageKeysFromFolders,
  getAllUserImageKeysAndPresignedUrls,
};
