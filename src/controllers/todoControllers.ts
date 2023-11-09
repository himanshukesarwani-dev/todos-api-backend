import { z } from "zod";

import { TodoManager } from "../model/todoManager.js";
import { todoSchema } from "../model/todoSchema.js";
import { type Request, type Response } from "express";

type Todo = z.infer<typeof todoSchema>;

// POST todo API

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { description, title, dueDate, completed } = req.body;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const todoManager = new TodoManager();
    const id = (await todoManager.getLengthOfTodos()) + 1;
    // console.log(id);
    const todo: Todo = {
      id,
      title,
      description,
      dueDate,
      createdAt,
      updatedAt,
      completed,
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
 * @throws {Error} - If an error occurs during the data retrieval process, an error response is sent.
 */

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todoManager = new TodoManager();
    const length = await todoManager.getLengthOfTodos();

    if (length !== 0) {
      const page: number = Number(req.query.page) || 1;
      const pageSize: number = Number(req.query.limit) || 10;
      const offset = (page - 1) * pageSize;

      const status = req.query.status; // Filter by status
      const sort = req.query.sort;

      let allTodos = await todoManager.getAllTodos(offset, offset + pageSize);

      if (status === "completed") {
        allTodos = allTodos.filter((todo) => todo.completed === true);
      }

      if (sort === "dueDate") {
        allTodos = allTodos.sort((a, b) => {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
        });
      }

      res.status(200).json(allTodos);
    } else {
      res.status(404).json({ error: "Error! No Todos Found" });
    }
  } catch (error) {
    res.status(404).json({ error: "Error! No Todos Found" });
  }
};

/**
 * Retrieves a single todo based on the provided ID and sends a response with the todo in JSON format.
 * If the specified todo does not exist, a 404 Not Found response is sent with an error message.
 *
 * @param {Request} req - The Express Request object, which contains information about the HTTP request, including the todo ID as a URL parameter.
 * @param {Response} res - The Express Response object, used to send the HTTP response.
 */
export const getATodo = async (req: Request, res: Response) => {
  const requestedTodo = Number(req.params.id);
  try {
    const todoManager = new TodoManager();
    const todo = await todoManager.getATodo(requestedTodo);
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({
        error: `Error! Requested Todo with ID ${requestedTodo} doesn't exist.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "An internal server error occurred while processing the request.",
    });
  }
};
