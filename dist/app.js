/* eslint-disable indent */
/* eslint-disable linebreak-style */
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
// POST todo API
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
// GET all Todos API
app.get("/todos", (req, res) => {
    if (allTodos.length != 0) {
        res.status(200).json(allTodos);
    }
    else {
        res.status(404).json({
            message: "Error! No Todos Found",
        });
    }
});
// GET a particular todo by its id.
app.get("/todos/:id", (req, res) => {
    const queryId = req.params.id;
    const queryTodo = allTodos.find((todo) => todo.id === Number(queryId));
    if (queryTodo) {
        res.status(200).json(queryTodo);
    }
    else {
        res.status(404).json({
            message: `Error! Requested Todo with ${queryId} doesn't exist.`,
        });
    }
});
// Update a existing TODO using PUT.
app.put("/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, description, dueDate } = req.body;
    const queryTodo = allTodos.find((todo) => todo.id === id);
    if (queryTodo) {
        const dataValidated = todoSchema.safeParse(queryTodo);
        if (dataValidated.success) {
            (queryTodo.title = title),
                (queryTodo.description = description),
                (queryTodo.dueDate = dueDate),
                (queryTodo.updatedAt = new Date().toISOString());
            db.write();
            res.status(200).json(dataValidated.data);
        }
        else {
            res.status(404).json({ error: "Error Not Found" });
        }
    }
});
// Delete a Todo
app.delete("/todos/:id", (req, res) => {
    const id = Number(req.params.id);
    const selectedIndex = allTodos.findIndex((item) => item.id === id);
    console.log(selectedIndex);
    if (selectedIndex !== -1) {
        allTodos.splice(selectedIndex, 1);
        db.write();
        res
            .status(204)
            .json({ message: `Todo with id ${id + 1} deleted successfully` });
    }
    else {
        res.status(404).json({ error: "Error! Cannot delete the todo" });
    }
});
// server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
