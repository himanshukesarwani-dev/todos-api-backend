import { z } from "zod";
import { JSONPreset } from "lowdb/node";
import { todoSchema } from "./todoSchema.js";

type todoType = z.infer<typeof todoSchema>;
const filename = "db.json";
const db = await JSONPreset(filename, { todos: [] });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allTodos: todoType[] = db.data.todos;
