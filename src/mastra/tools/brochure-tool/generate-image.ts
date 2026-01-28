import { createTool } from "@mastra/core";
import z from "zod";

export const imageGeneratorTool = createTool({
  id: "image-generator",
  description:
    "Generates promotional image  and uploads them to cloud storage, returning the public URL",
  inputSchema: z.object({
    prompt: z.string().describe("Description of the image to generate"),
  }),
  outputSchema: z.object({
    imageUrl: z
      .string()
      .describe("Public URL of the uploaded image in cloud storage"),
  }),
  execute: async ({ context }) => {
    try {
      throw new Error("Deprecated");
      /*       
    const { prompt } = context;
      
      const response = await googleAi.models.generateImages({
        model: "imagen-4.0-generate-001",
        prompt: prompt,
        config: {
          numberOfImages: 1,
        },
      });

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
      const filename = `ai-generated/brochure-${Date.now()}.png`;

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
        }),
      );

      const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

      console.log("✅ Image generated successfully with AI package");

      return {
        imageUrl: publicUrl,
      }; */
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Image generation failed:", errorMessage);
      throw new Error(`Failed to generate image: ${errorMessage}`);
    }
  },
});
