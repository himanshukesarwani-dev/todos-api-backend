import express from "express";
import todoRouter from "./routes/todoRoutes.js";
import apiAuthMiddleware from "./middlewares/apiAuthMiddleware.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(apiAuthMiddleware);
app.use("/api/v1/todos", todoRouter);
// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
