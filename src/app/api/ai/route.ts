import { r2 } from "@/libs/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
  try {
    const model = "imagen-4.0-generate-001";
    const prompt = "A banana in the middle taped to a white background";

    console.log(`Generating image with model: ${model} and prompt: ${prompt}`);

    const response = await ai.models.generateImages({
      model: model,
      prompt: prompt,
      config: {
        numberOfImages: 1,
      },
    });

    console.log("Image generation response received");

    // @ts-ignore - The type definition might be missing generatedImages
    const generatedImages = response.generatedImages;

    if (!generatedImages || generatedImages.length === 0) {
      throw new Error("No image generated");
    }

    const imageObj = generatedImages[0];
    // Check for imageBytes or just image (depending on SDK version)
    const imageBase64 = (imageObj.image?.imageBytes ||
      imageObj.image) as string;

    if (!imageBase64) {
      throw new Error("Image data is empty");
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const filename = `ai-generated/banana-${Date.now()}.png`;

    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error("R2_BUCKET_NAME environment variable is not set");
    }

    console.log(`Uploading to R2 bucket: ${bucketName}, key: ${filename}`);

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: "image/png",
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

    return NextResponse.json({
      message: "Image generated and uploaded successfully",
      url: publicUrl,
      path: filename,
    });
  } catch (error: any) {
    console.error("Error generating or uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
