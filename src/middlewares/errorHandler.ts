import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { customErrorClass } from "../errors/customError.js";

/**
 * Express middleware for handling errors and generating appropriate error responses.
 *
 * @param err - The error object to be handled.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next function to pass control to the next middleware.
 * @returns {Response} - A JSON response containing error details and an appropriate status code.
 */

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // checking if error is an instance of zod validation.
  if (err instanceof z.ZodError) {
    const allErrorMessages = err.issues.map(
      (issue) => `${issue.code} ${issue.path}: ${issue.message}`
    );
    return res
      .status(400)
      .json({ error: `Validation Error: ${allErrorMessages}` });
  }

  // checking if the error is instance of customErrorClass
  else if (err instanceof customErrorClass) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // unknown/server errors.
  else {
    return res.status(500).json({
      error: "An internal server error occurred while processing the request."
    });
  }
};
