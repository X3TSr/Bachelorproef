import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

// Middleware to process errors in the application.
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details if not in production.
  // This helps in debugging by printing the error stack or the error itself.
  if (process.env.NODE_ENV !== "production") {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error(err);
    }
  }

  // Handle custom application errors.
  // These errors already include a status code and a clear message.
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Determine the status code and error message.
  // This covers errors that don't have predefined structures.
  const statusCode =
    typeof err === "object" && err !== null && "statusCode" in err
      ? (err as { statusCode: number }).statusCode
      : 500;

  const errorMessage =
    typeof err === "object" && err !== null && "message" in err
      ? (err as { message: string }).message
      : "Internal server error";

  // Prepare the final response.
  // In production, avoid exposing technical details by using a generic message.
  const responseMessage =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : errorMessage;

  res.status(statusCode).json({
    message: responseMessage,
  });
};