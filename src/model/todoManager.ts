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
  /**
   * getAllTodos gets all the todos from database and returns it.
   * @returns total todos
   */

  async getAllTodos(): Promise<Todo[]> {
    await this.db.read();
    const allTodos = await this.db.data.todos;
    return allTodos;
  }

  /**
   * get a todo takes query id and returns that todo from the database.
   * @param id number
   * @returns todo if todo is found in the database, else returns undefined.
   */
  async getATodo(id: number): Promise<Todo | undefined> {
    await this.db.read();
    const allTodos = this.db.data.todos;
    const todo = allTodos.find((todo) => todo.id === id);
    return todo;
  }
  /**
   * updateTodo method updates a existing todo with the new todo data.
   * @param id todo Id
   * @param todo updated Todo Values
   * @returns todo with updated values.
   */

  async updateTodo(id: number, todo: Todo): Promise<Todo> {
    await this.db.read();
    const todoToUpdate = this.db.data.todos.find(
      // eslint-disable-next-line prettier/prettier
      (dbTodo) => dbTodo.id === id,
    ) as Todo;

    todoToUpdate.title = todo.title;
    todoToUpdate.description = todo.description;
    todoToUpdate.dueDate = todo.dueDate;
    todoToUpdate.createdAt = todo.createdAt;
    todoToUpdate.updatedAt = todo.updatedAt;
    await this.db.write();
    return todoToUpdate;
  }
}
