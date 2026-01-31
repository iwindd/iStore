export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export const parseKeywords = (keywords: unknown) => {
  if (Array.isArray(keywords)) return keywords;
  try {
    if (typeof keywords === "string") return JSON.parse(keywords);
  } catch (error) {
    console.error(`Error parsing keywords: ${error}`);
    return [];
  }

  return [];
};
