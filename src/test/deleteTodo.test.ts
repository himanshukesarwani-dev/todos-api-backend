import request from "supertest";
import { describe, test, expect } from "vitest";
import app from "../app.js";

describe("DELETE /api/v1/todos/:id", async () => {
  test("should delete todo with id 29", async () => {
    const response = await request(app)
      .delete("/api/v1/todos/29")
      .set("Authorization", "Bearer abcde12345");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: "todo deleted successfully with id 29"
    });
  });

  test("should delete todo with id 30", async () => {
    const response = await request(app)
      .delete("/api/v1/todos/30")
      .set("Authorization", "Bearer abcde12345");
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: "todo deleted successfully with id 30"
    });
  });

  test("this will throw error as the todo id is invalid", async () => {
    const response = await request(app)
      .delete("/api/v1/todos/invalidid")
      .set("Authorization", "Bearer abcde12345");
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: "Cannot find the todo with id invalidid"
    });
  });
});
