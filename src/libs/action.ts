import { z, ZodIssue } from "zod";

export interface ActionResponse<T>{
  success: boolean,
  data: T,
  total?: number
  errors?: Record<keyof T, ZodIssue>,
  message?: string,
  error?: any
}

export const ActionError = (error: any) => {
  if (error instanceof z.ZodError) {
    // Handle Zod validation errors
    return {
      success: false,
      errors: error.errors, // Passes validation errors to the client
    };
  } else {
    // Handle other errors (e.g., network, database)
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";

    if (process.env.NODE_ENV === 'development') {
      console.error("Action Error:", error);
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};