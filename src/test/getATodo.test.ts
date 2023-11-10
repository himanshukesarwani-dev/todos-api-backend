import request from "supertest";
import app from "../app.js";
import { describe, test, expect } from "vitest";

// testing the GET - getATodo API

describe("GET /api/v1/todos/:id", async () => {
  test("It should get a Todo with id 2.", async () => {
    const response = await request(app)
      .get("/api/v1/todos/2")
      .set("Authorization", "Bearer abcde12345");

    expect(response.body).toEqual({
      id: 2,
      title: "2 on 30 oct",
      description: "Finish the report by 5 PM",
      dueDate: "2023-10-31",
      createdAt: "2023-10-30T05:57:50.083Z",
      updatedAt: "2023-10-30T05:57:50.083Z"
    });
  });

  test("It should get a Todo with id 21.", async () => {
    const response = await request(app)
      .get("/api/v1/todos/21")
      .set("Authorization", "Bearer abcde12345");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      id: 21,
      title: "valid test title",
      description: "This is a valid test todo.",
      dueDate: "2023-12-31",
      completed: false,
      createdAt: "2023-11-10T14:09:50.402Z",
      updatedAt: "2023-11-10T14:09:50.402Z"
    });
  });
  test("It should throw error as the requested todo id doesn't exist", async () => {
    const response = await request(app)
      .get("/api/v1/todos/212")
      .set("Authorization", "Bearer abcde12345");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: "Error! Requested Todo with ID 212 doesn't exist."
    });
  });

  test("It should throw error as the requested todo is not a valid number ", async () => {
    const response = await request(app)
      .get("/api/v1/todos/sdfsf")
      .set("Authorization", "Bearer abcde12345");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: "Error! Requested Todo with ID sdfsf doesn't exist."
    });
  });
});
