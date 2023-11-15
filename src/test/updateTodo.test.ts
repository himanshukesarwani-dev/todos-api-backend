import request from "supertest";
import app from "../app.js";
import { describe, test, expect } from "vitest";

describe("PUT /api/v1/todos/:id", async () => {
  test("should update an existing todo with id 3", async () => {
    const updatedTodoData = {
      title: "Test Todo updated",
      description: "This is a test todo updated.",
      dueDate: "2023-12-31",
      completed: false
    };
    const response = await request(app)
      .put("/api/v1/todos/3")
      .set("Authorization", "Bearer abcde12345")
      .send(updatedTodoData);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: 3,
      title: "Test Todo updated",
      description: "This is a test todo updated.",
      dueDate: "2023-12-31",
      createdAt: "2023-11-03T09:48:46.613Z",
      updatedAt: "2023-11-03T09:48:46.613Z",
      completed: false
    });
  });

  test("should update an existing todo with id 10", async () => {
    const updatedTodoData = {
      title: "Todo updated",
      description: "todo updated with id 10.",
      dueDate: "2023-12-31",
      completed: true
    };
    const response = await request(app)
      .put("/api/v1/todos/10")
      .set("Authorization", "Bearer abcde12345")
      .send(updatedTodoData);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: 10,
      title: "Todo updated",
      description: "todo updated with id 10.",
      dueDate: "2023-12-31",
      createdAt: "2023-11-03T11:56:56.432Z",
      updatedAt: "2023-11-03T11:56:56.432Z",
      completed: true
    });
  });

  test("should throw zod error as the new title exceeds the character limit", async () => {
    const updatedTodoData = {
      title:
        "Todo updated with a really long title and it will exceed the character limit of the title.",
      description: "todo updated using put",
      dueDate: "2023-12-31",
      completed: true
    };
    const response = await request(app)
      .put("/api/v1/todos/11")
      .set("Authorization", "Bearer abcde12345")
      .send(updatedTodoData);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error:
        "Validation Error: too_big title: Title must be maximum of 20 characters."
    });
  });

  test("should throw error as the todo id is invalid", async () => {
    const updatedTodoData = {
      title:
        "Todo updated with a really long title and it will exceed the character limit of the title.",
      description: "todo updated using put",
      dueDate: "2023-12-31",
      completed: true
    };
    const response = await request(app)
      .put("/api/v1/todos/11ee")
      .set("Authorization", "Bearer abcde12345")
      .send(updatedTodoData);

    expect(response.body).toEqual({ error: "Todo with id 11ee not found" });
    expect(response.statusCode).toEqual(404);
  });
});
