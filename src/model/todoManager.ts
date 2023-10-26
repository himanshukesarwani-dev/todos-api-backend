import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { z } from "zod";
import { todoSchema } from "../model/todoSchema.js";

type Todo = z.infer<typeof todoSchema>;
export interface AllTodosType {
  todos: Todo[];
}

export class TodoManager {
  private static instance: TodoManager;
  private readonly db: Low<AllTodosType>;

  /**
   * Private constructor for initializing a database instance.
   */
  private constructor() {
    const adapter = new JSONFile<AllTodosType>("db.json");
    this.db = new Low(adapter, { todos: [] });
  }

  /** getInstance method
   * Get a singleton instance of TodoManager.
   * @returns {TodoManager} - The singleton instance of TodoManager.
   */
  static getInstance(): TodoManager {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new TodoManager();
    return this.instance;
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
   *
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
}