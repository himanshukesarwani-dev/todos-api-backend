import { z } from "zod";

import { TodoManager } from "../model/todoManager.js";
import { todoSchema } from "../model/todoSchema.js";
import { type Request, type Response } from "express";

type Todo = z.infer<typeof todoSchema>;

// POST todo API

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { description, title, dueDate } = req.body;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const todoManager = TodoManager.getInstance();
    const id = (await todoManager.getLengthOfTodos()) + 1;
    console.log(id);
    const todo: Todo = {
      id,
      title,
      description,
      dueDate,
      createdAt,
      updatedAt,
    };

    const dataValidated = await todoManager.validateTodo(todo);
    const newTodo = await todoManager.createTodo(dataValidated);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: "Cannot create Todo" });
  }
};
