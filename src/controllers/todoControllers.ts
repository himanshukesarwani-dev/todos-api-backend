import { z } from "zod";

import { TodoManager } from "../model/todoManager.js";
import { todoSchema } from "../model/todoSchema.js";
import { NextFunction, type Request, type Response } from "express";
import { createCustomError } from "../errors/customError.js";
import { asyncControllerWrapper } from "../utility/asyncControllerWrapper.js";

type Todo = z.infer<typeof todoSchema>;

/**
 * Creates a new todo item.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction to pass control to the next middleware.
 *
 */

export const createTodo = asyncControllerWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { description, title, dueDate, completed } = req.body;

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const todoManager = new TodoManager();
    const id = (await todoManager.getHighestTodoId()) + 1;
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
  }
);

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

/**
 * updateTodo is a controller function that asynchronously updates a Todo item in the database.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @param {NextFunction} next - Express NextFunction for error handling.
 * */

export const updateTodo = asyncControllerWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const todoManager = new TodoManager();
    const existingTodo = await todoManager.getATodo(id);
    const { title, description, dueDate, completed } = req.body;

    if (existingTodo) {
      const todo: Todo = {
        id,
        title,
        description,
        dueDate,
        completed: completed || existingTodo.completed,
        createdAt: existingTodo.createdAt,
        updatedAt: new Date().toISOString()
      };

      const todoValidated = await todoManager.validateTodo(todo);
      const updatedTodo = await todoManager.updateTodo(id, todoValidated);
      res.status(200).json(updatedTodo);
    } else {
      throw createCustomError(404, `Todo with id ${req.params.id} not found`);
    }
  }
);

/**
 * deleteTodo is a controller function that asynchronously deletes a Todo item from the database.
 *
 * This function handles the HTTP DELETE request for deleting a Todo based on its ID.
 *
 * @param {Request} req - Express Request object containing parameters and other request data.
 * @param {Response} res - Express Response object for sending the HTTP response.
 * @param {NextFunction} next - Express NextFunction for error handling and passing control to the next middleware.
 *
 */

export const deleteTodo = asyncControllerWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const todoManager = new TodoManager();
    const existingTodo = await todoManager.getATodo(id);

    if (existingTodo) {
      await todoManager.deleteTodo(id);
      res
        .status(200)
        .json({ message: `todo deleted successfully with id ${id}` });
    } else {
      throw createCustomError(
        404,
        `Cannot find the todo with id ${req.params.id}`
      );
    }
  }
);
