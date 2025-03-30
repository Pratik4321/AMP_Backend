// creating a custom error handling class to manage errors in APIs
export class ApiError extends Error {
  public statusCode: number;
  public message: string;
  public success: boolean;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}
