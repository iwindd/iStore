"use server";

import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function getPresignedUrl(
  filename: string,
  contentType: string,
  prefix: string = "broadcasts"
) {
  if (
    !process.env.R2_BUCKET_NAME ||
    !process.env.R2_PUBLIC_URL ||
    !process.env.R2_ACCOUNT_ID
  ) {
    throw new Error("R2 configuration missing");
  }

  const fileExtension = filename.split(".").pop();
  const uniqueKey = `${prefix}/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueKey}`;

    return { signedUrl, publicUrl };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}
