import { z } from "zod";

import { TodoManager } from "../model/todoManager.js";
import { todoSchema } from "../model/todoSchema.js";
import { NextFunction, type Request, type Response } from "express";
import { createCustomError } from "../errors/customError.js";
import { asyncControllerWrapper } from "../utility/asyncControllerWrapper.js";

type Todo = z.infer<typeof todoSchema>;

// POST todo API

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      completed
    };

    const dataValidated = await todoManager.validateTodo(todo);
    const newTodo = await todoManager.createTodo(dataValidated);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a list of all todos from the data source and sends a response with the todos in JSON format.
 *
 * @param {Request} req - The Express Request object, which contains information about the HTTP request.
 * @param {Response} res - The Express Response object, used to send the HTTP response.
 * @param {NextFunction} next - The next function to pass control to the next middleware.

 */

export const getAllTodos = asyncControllerWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
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
      throw createCustomError(404, "Error 404: No Todos Found");
    }
  }
);

/**
 * Retrieves a single todo based on the provided ID and sends a response with the todo in JSON format.
 * If the specified todo does not exist, a 404 Not Found response is sent with an error message.
 *
 * @param {Request} req - The Express Request object, which contains information about the HTTP request, including the todo ID as a URL parameter.
 * @param {Response} res - The Express Response object, used to send the HTTP response.
 * @param {NextFunction} - The next function to pass control to the next middleware.
 */
export const getATodo = asyncControllerWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestedTodo = Number(req.params.id);
    const todoManager = new TodoManager();
    const todo = await todoManager.getATodo(requestedTodo);
    if (todo) {
      res.status(200).json(todo);
    } else {
      throw createCustomError(
        404,
        `Error! Requested Todo with ID ${req.params.id} doesn't exist.`
      );
    }
  }
);
