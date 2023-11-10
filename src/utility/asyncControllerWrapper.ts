import { type Request, type Response, type NextFunction } from "express";

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncControllerWrapper = (
  func: RequestHandler
): RequestHandler => {
  const asyncHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return asyncHandler;
};
