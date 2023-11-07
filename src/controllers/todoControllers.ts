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

// Get All Todos

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todoManager = TodoManager.getInstance();
    const length = await todoManager.getLengthOfTodos();
    const allTodos = await todoManager.getAllTodos();
    if (length !== 0) {
      res.status(200).json(allTodos);
    }
  } catch (error) {
    res.status(404).json({ error: "Error! No Todos Found" });
  }
};

// Get a Todo
export const getATodo = async (req: Request, res: Response) => {
  const queryId = Number(req.params.id);
  try {
    // console.log(queryId);
    const todoManager = TodoManager.getInstance();
    const todo = await todoManager.getATodo(queryId);
    res.status(200).json(todo);
  } catch (error) {
    res
      .status(404)
      .json({ error: `Error! Requested Todo with ${queryId} doesn't exist.` });
  }
};
