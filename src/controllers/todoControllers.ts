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

/**
 * Retrieves a list of all todos from the data source and sends a response with the todos in JSON format.
 *
 * @param {Request} req - The Express Request object, which contains information about the HTTP request.
 * @param {Response} res - The Express Response object, used to send the HTTP response.
 *
 * @returns {Promise<void>} - A Promise that resolves with the response containing the list of todos.
 *
 * @throws {Error} - If an error occurs during the data retrieval process, an error response is sent.
 */

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todoManager = TodoManager.getInstance();
    const length = await todoManager.getLengthOfTodos();
    const allTodos = await todoManager.getAllTodos();
    if (length !== 0) {
      res.status(200).json(allTodos);
    } else {
      res.status(404).json({ error: "Error! No Todos Found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Error! No Todos Found" });
  }
};
