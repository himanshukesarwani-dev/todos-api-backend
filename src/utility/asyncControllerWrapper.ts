import { type Request, type Response, type NextFunction } from "express";

//  Type Alias for an Asynchronous Request Handler
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Async Controller Wrapper
 *
 * A utility function that wraps an asynchronous controller function,
 * adding consistent error-handling logic to forward errors to the global error handler.
 *
 * @param {RequestHandler} func - The asynchronous controller function to be wrapped.
 * @returns {RequestHandler} - A wrapped version of the original controller function with error-handling.
 */

export const asyncControllerWrapper = (
  func: RequestHandler
): RequestHandler => {
  /**
   * Asynchronous Handler Function
   *
   * This function wraps the original controller function with error-handling logic.
   * If an error occurs during the execution of the original function, it is caught,
   * and the error is forwarded to the next middleware (global error handler).
   *
   * @param {Request} req - Express.js Request object.
   * @param {Response} res - Express.js Response object.
   * @param {NextFunction} next - Express.js Next function.
   * @returns {Promise<void>} - A promise that resolves to void.
   */

  const asyncHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Call the original controller function and await its result.
      await func(req, res, next);
    } catch (error) {
      // If an error occurs, forward it to the global error handler.
      next(error);
    }
  };
  // Return the wrapped asynchronous handler function
  return asyncHandler;
};
