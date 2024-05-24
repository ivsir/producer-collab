import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

const s3 = new S3Client();
const BUCKET = process.env.BUCKET || "react-image-upload-ivsir";
console.log(BUCKET)
export const uploadToS3 = async ({ file, userId }) => {
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
    console.log(error);
    return { error };
  }
};

export const getImageKeysByUser = async (userId) => {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: userId,
  });

  const { Contents = [] } = await s3.send(command);

  return Contents.sort(
    (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
  ).map((image) => image.Key);
};

export const getUserPresignedUrls = async (userId) => {
  try {
    const imageKeys = await getImageKeysByUser(userId);

    const presignedUrls = await Promise.all(
      imageKeys.map((key) => {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        return getSignedUrl(s3, command, { expiresIn: 900 }); // default
      })
    );
    // console.log(presignedUrls)
    return { presignedUrls };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

export const getPresignedUrls = async (userId) => {
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
    console.log(error);
    return { error };
  }
};

export const getAllUserIds = async () => {
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

export const getImageKeysFromFolders = async (folderNames) => {
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

export const getAllUserImageKeysAndPresignedUrls = async () => {
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
    console.log(error);
    return { error };
  }
};

