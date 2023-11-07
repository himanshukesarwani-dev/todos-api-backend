import express from "express";
import {
  createTodo,
  getAllTodos,
  getATodo,
} from "../controllers/todoControllers.js";
const router = express.Router();

router.route("/").post(createTodo).get(getAllTodos);
router.route("/:id").get(getATodo);

export default router;
