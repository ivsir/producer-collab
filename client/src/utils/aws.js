import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-west-1" }); // Replace "your-region" with your AWS region

async function createS3Bucket(userId) {
  const bucketName = `user-${userId}-bucket`; // You can customize the bucket naming
  try {
    const createBucketParams = {
      Bucket: bucketName,
    };

    await s3Client.send(new CreateBucketCommand(createBucketParams));
    return bucketName;
  } catch (error) {
    console.error("Error creating S3 bucket:", error);
    throw error;
  }
}

export { createS3Bucket };
