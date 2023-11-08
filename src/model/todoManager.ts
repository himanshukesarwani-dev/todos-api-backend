import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { z } from "zod";
import { todoSchema } from "../model/todoSchema.js";

type Todo = z.infer<typeof todoSchema>;
export interface AllTodosType {
  todos: Todo[];
}

export class TodoManager {
  private readonly db: Low<AllTodosType>;

  /**
   * Constructor for initializing a database instance.
   */
  constructor() {
    const adapter = new JSONFile<AllTodosType>("db.json");
    this.db = new Low(adapter, { todos: [] });
  }

  /**
   * Validates a todo item against the defined schema.
   * @param {Todo} todo - The todo item to be validated.
   * @returns Promise that resolves to Todo object.
   */
  async validateTodo(todo: Todo): Promise<Todo> {
    const validatedTodo = todoSchema.parse(todo);
    return validatedTodo;
  }

  /**
   * Creates a new todo item and adds it to the database.
   * @param newTodo - The new todo item to be created.
   * @returns Promise resolving to true (success) if todo is created successfully.
   */
  async createTodo(newTodo: Todo): Promise<Todo> {
    await this.db.read();
    this.db.data.todos.push({ ...newTodo });
    await this.db.write();
    return newTodo;
  }

  /**
   * Finds the total length of todos.
   * Takes no params
   * @returns total length of todos array from db.json
   */
  async getLengthOfTodos(): Promise<number> {
    await this.db.read();
    const length = this.db.data.todos.length;
    return length;
  }

  /**
   * getAllTodos gets all the todos from the database and returns them.
   * @returns a promise with the total todos in the database.
   */
  async getAllTodos(): Promise<Todo[]> {
    await this.db.read();
    const allTodos = await this.db.data.todos;
    return allTodos;
  }
}
