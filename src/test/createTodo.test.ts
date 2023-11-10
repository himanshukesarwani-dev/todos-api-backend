import request from "supertest";
import app from "../app.js";
import { describe, test, expect } from "vitest";

// testing the POST - createTodo API

describe("POST /api/v1/todos", async () => {
  test("should create a new todo", async () => {
    const validTodoData = {
      title: "Test Todo",
      description: "This is a test todo.",
      dueDate: "2023-12-31",
      completed: false
    };

    const response = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abcde12345")
      .send(validTodoData);

    expect(response.statusCode).toEqual(201);
    expect(response.body.title).toEqual(validTodoData.title);
    expect(response.body.description).toEqual(validTodoData.description);
    expect(response.body.dueDate).toEqual(validTodoData.dueDate);
    expect(response.body.completed).toEqual(validTodoData.completed);
  });

  test("should create a new todo again", async () => {
    const validTodoData = {
      title: "valid test title",
      description: "This is a valid test todo.",
      dueDate: "2023-12-31"
    };

    const response = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abcde12345")
      .send(validTodoData);

    expect(response.statusCode).toEqual(201);
    expect(response.body.title).toEqual(validTodoData.title);
    expect(response.body.description).toEqual(validTodoData.description);
    expect(response.body.dueDate).toEqual(validTodoData.dueDate);
  });

  test("It shoud throw an error because title is invalid. (zod error)", async () => {
    const invalidTodo = {
      title: 23,
      description: "This is a valid test todo.",
      dueDate: "2023-12-31"
    };

    const response = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abcde12345")
      .send(invalidTodo);

    expect(response.body.title).toBe(undefined);
    expect(response.body.description).toEqual(undefined);
    expect(response.body.dueDate).toEqual(undefined);
    expect(response.body).toEqual({
      error:
        "Validation Error: invalid_type title: Expected string, received number"
    });
  });

  test("should throw an error because description is invalid. (zod error)", async () => {
    const invalidTodo = {
      title: "title",
      description: "no",
      dueDate: "2023-12-31"
    };

    const response = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abcde12345")
      .send(invalidTodo);

    expect(response.body.title).toBe(undefined);
    expect(response.body.description).toEqual(undefined);
    expect(response.body.dueDate).toEqual(undefined);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error:
        "Validation Error: too_small description: Description must be minimum 5 characters long."
    });
  });

  test("It should throw error because title, description and due date are invalid. (zod error)", async () => {
    const invalidTodo = {
      title: 2,
      description: "no",
      dueDate: "203-12-31"
    };

    const response = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", "Bearer abcde12345")
      .send(invalidTodo);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error:
        "Validation Error: invalid_type title: Expected string, received number,too_small description: Description must be minimum 5 characters long.,invalid_string dueDate: Due Date must be in the format 'YYYY-MM-DD'."
    });
  });
});
