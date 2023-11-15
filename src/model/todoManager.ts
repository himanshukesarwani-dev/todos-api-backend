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
  async getAllTodos(startIndex: number, endIndex: number): Promise<Todo[]> {
    await this.db.read();
    const allTodos = await this.db.data.todos;
    const selectedTodos = allTodos.slice(startIndex, endIndex);
    return selectedTodos;
  }

  /**
   * getATodo takes todo id and returns that todo from the database.
   * @param id - the todo id which we want to retrieve.
   * @returns todo if todo is found in the database, else returns undefined.
   */
  async getATodo(id: number): Promise<Todo | undefined> {
    await this.db.read();
    const allTodos = this.db.data.todos;
    const todo = allTodos.find((todo) => todo.id === id);
    return todo;
  }

  /**
   * getHighestTodoId method is used to retrieve the highest ID among existing todos from the database.
   * @returns {Promise<number>} A Promise that resolves to the highest todo ID.
   */

  async getHighestTodoId(): Promise<number> {
    await this.db.read();
    let highestId;
    const allTodos = this.db.data.todos;
    if (allTodos.length === 0) {
      highestId = -1;
    } else {
      const allTodosId = allTodos.map((todo) => todo.id);
      highestId = Math.max(...allTodosId);
    }
    return highestId;
  }

  /**
   * updateTodo method asynchronously updates a Todo item in the database based on its ID.
   * @param {number} id - Unique identifier of the Todo item.
   * @param {Todo} todo - Updated Todo object.
   * @returns {Promise<Todo>} A Promise that resolves to the updated Todo.
   */

  async updateTodo(id: number, todo: Todo): Promise<Todo> {
    await this.db.read();
    const todoToUpdate = this.db.data.todos.find(
      (dbTodo) => dbTodo.id === id
    ) as Todo;

    todoToUpdate.title = todo.title;
    todoToUpdate.description = todo.description;
    todoToUpdate.dueDate = todo.dueDate;
    todoToUpdate.completed = todo.completed;
    todoToUpdate.createdAt = todo.createdAt;
    todoToUpdate.updatedAt = todo.updatedAt;
    await this.db.write();
    return todoToUpdate;
  }

  async deleteTodo(id: number): Promise<void> {
    await this.db.read();
    const indexToDelete = this.db.data.todos.findIndex(
      (todo) => todo.id === id
    );
    this.db.data.todos.splice(indexToDelete, 1);
    await this.db.write();
  }
}
