export class OperationalError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational = true,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
