import "dotenv/config";
import { Response, Request, NextFunction } from "express";

const apiKey: string | undefined = process.env.API_KEY;

function apiAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientSendApiKey = req.header("Authorization");
  // console.log(clientSendApiKey);

  if (!clientSendApiKey) {
    res.status(401).json({ message: "Enter API Key!" });
  } else if (clientSendApiKey === `Bearer ${apiKey}`) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export default apiAuthMiddleware;
