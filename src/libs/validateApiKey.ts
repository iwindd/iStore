import db from "@/libs/db";

export interface ValidateApiKeyResult {
  valid: boolean;
  storeId?: string;
  error?: string;
}

/**
 * Validate an API key from the Authorization header
 * Expected format: Bearer <api_key>
 */
export async function validateApiKey(
  request: Request
): Promise<ValidateApiKeyResult> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return { valid: false, error: "Missing Authorization header" };
  }

  const [type, apiKey] = authHeader.split(" ");

  if (type !== "Bearer" || !apiKey) {
    return {
      valid: false,
      error: "Invalid Authorization format. Expected: Bearer <api_key>",
    };
  }

  const store = await db.store.findUnique({
    where: {
      api_key: apiKey,
    },
    select: {
      id: true,
    },
  });

  if (!store) {
    return { valid: false, error: "Invalid API key" };
  }

  return { valid: true, storeId: store.id };
}
