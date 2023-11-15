import express from "express";
import {
  createTodo,
  deleteTodo,
  getATodo,
  getAllTodos,
  updateTodo
} from "../controllers/todoControllers.js";
const router = express.Router();

router.route("/").post(createTodo).get(getAllTodos);
router.route("/:id").get(getATodo).put(updateTodo).delete(deleteTodo);

export default router;
