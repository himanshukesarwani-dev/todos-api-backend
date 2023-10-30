/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
import express from "express";
import { JSONPreset } from "lowdb/node";
import { todoSchema } from "./todoSchema.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const filename = "db.json";
const db = await JSONPreset(filename, { todos: [] });
const allTodos = db.data.todos;
app.post("/todos", (req, res) => {
    const { description, title, dueDate } = req.body;
    const id = allTodos.length + 1;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const todo = {
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
    }
    else {
        res.status(400).json(dataValidated.error);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
