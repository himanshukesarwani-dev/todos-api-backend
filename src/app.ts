/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */

import express, { type Request, type Response } from "express";

import { z } from "zod";
import { JSONPreset } from "lowdb/node";
import { todoSchema } from "./todoSchema.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

type todoType = z.infer<typeof todoSchema>;
const filename = "db.json";
const db = await JSONPreset(filename, { todos: [] });
const allTodos: todoType[] = db.data.todos;

// POST todo API

app.post("/todos", (req: Request, res: Response) => {
  const { description, title, dueDate } = req.body;
  const id = allTodos.length + 1;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const todo: todoType = {
    id,
    title,
    description,
    dueDate,
    createdAt,
    updatedAt,
  };

  const dataValidated = todoSchema.safeParse(todo);
  console.log(dataValidated);

  if (dataValidated.success) {
    allTodos.push(todo);
    db.write();
    res.status(201).json(dataValidated.data);
  } else {
    res.status(400).json(dataValidated.error);
  }
});

// GET all Todos API
app.get("/todos", (req: Request, res: Response) => {
  if (allTodos.length != 0) {
    res.status(200).json(allTodos);
  } else {
    res.status(404).json({
      message: "Error! No Todos Found",
    });
  }
});

// GET a particular todo by its id.

app.get("/todos/:id", (req: Request, res: Response) => {
  const queryId = req.params.id;
  const queryTodo = allTodos.find((todo) => todo.id === Number(queryId));

  if (queryTodo) {
    res.status(200).json(queryTodo);
  } else {
    res.status(404).json({
      message: `Error! Requested Todo with ${queryId} doesn't exist.`,
    });
  }
});

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
