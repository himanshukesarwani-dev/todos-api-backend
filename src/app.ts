import express from "express";
import todoRouter from "./routes/todoRoutes.js";
import apiAuthMiddleware from "./middlewares/apiAuthMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { routeNotFound } from "./middlewares/routeNotFound.js";

const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(apiAuthMiddleware);
app.use("/api/v1/todos", todoRouter);
app.use(routeNotFound);
app.use(errorHandler);

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
