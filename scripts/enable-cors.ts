import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error("Missing R2 credentials in environment variables.");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function main() {
  console.log(`Configuring CORS for bucket: ${bucketName}...`);

  const command = new PutBucketCorsCommand({
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "GET", "HEAD"], // Essential methods
          AllowedOrigins: ["*"], // Allow all for simplicity, strictly restrict in prod if needed
          ExposeHeaders: [],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  });

  try {
    await r2.send(command);
    console.log("CORS configuration applied successfully!");
  } catch (error) {
    console.error("Error applying CORS configuration:", error);
    process.exit(1);
  }
}

main();
