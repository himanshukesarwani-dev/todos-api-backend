import { type Response, type Request } from "express";
/**
 * Handles the request when a route does not exist.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns {Response} - A JSON response with a 404 status code and an error message indicating that the route doesn't exist.
 */

export const routeNotFound = (req: Request, res: Response): Response => {
  return res.status(404).json({ error: "Route doesn't Exist" });
};
