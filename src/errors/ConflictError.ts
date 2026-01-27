export class ConflictError extends Error {
  readonly code = "CONFLICT";
  readonly status = 409;

  constructor(message: string = "Conflict") {
    super(message);
  }
}
