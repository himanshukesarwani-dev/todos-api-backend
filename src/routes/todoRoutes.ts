import express from "express";
import {
  createTodo,
  getATodo,
  getAllTodos,
  updateTodo
} from "../controllers/todoControllers.js";
const router = express.Router();

router.route("/").post(createTodo).get(getAllTodos);
router.route("/:id").get(getATodo).put(updateTodo);

export default router;
