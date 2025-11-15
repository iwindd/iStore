import { ZodSchema } from "zod";

export const parseJson = (text: string, schema: ZodSchema) => {
  const raw = text;

  const jsonString = new RegExp(/<json>([\s\S]*?)<\/json>/).exec(raw)?.[1];

  if (!jsonString) throw new Error("Invalid JSON format from AI");

  const data = JSON.parse(jsonString);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Failed to parse JSON from AI");
  }

  return parsed.data;
};

export const getPromptStructure = (
  prompt: string,
  data: string[],
  rules: string[]
) => {
  return `
${prompt}

ข้อมูล:
- ${data.join("\n- ")}

ข้อกำหนด:
- ${rules.join("\n- ")}

    `.trim();
};
