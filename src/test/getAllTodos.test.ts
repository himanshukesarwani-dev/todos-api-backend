import request from "supertest";
import app from "../app.js";
import { describe, test, expect } from "vitest";

// testing the GET - getAllTodos API

describe("GET /api/v1/todos/", async () => {
  const expectedDbData = [
    {
      id: 1,
      title: "new on 30 oct",
      description: "Finish the report by 5 PM",
      dueDate: "2023-10-31",
      createdAt: "2023-10-30T05:03:37.524Z",
      updatedAt: "2023-10-30T05:03:37.524Z"
    },
    {
      id: 2,
      title: "2 on 30 oct",
      description: "Finish the report by 5 PM",
      dueDate: "2023-10-31",
      createdAt: "2023-10-30T05:57:50.083Z",
      updatedAt: "2023-10-30T05:57:50.083Z"
    },
    {
      id: 3,
      title: " 4-todos",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T09:48:46.613Z",
      updatedAt: "2023-11-03T09:48:46.613Z"
    },
    {
      id: 4,
      title: " todddddos",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T09:48:54.430Z",
      updatedAt: "2023-11-03T09:48:54.430Z"
    },
    {
      id: 5,
      title: " sdfsadfasf",
      description: "new data",
      dueDate: "2023-10-31",
      completed: true,
      createdAt: "2023-11-03T09:48:59.875Z",
      updatedAt: "2023-11-03T09:48:59.875Z"
    },
    {
      id: 6,
      title: " sdfsadfasf",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T11:51:25.709Z",
      updatedAt: "2023-11-03T11:51:25.709Z"
    },
    {
      id: 7,
      title: " sdfsf",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T11:51:35.230Z",
      updatedAt: "2023-11-03T11:51:35.230Z"
    },
    {
      id: 8,
      title: " sdfssdfasdfasfdf",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T11:54:06.246Z",
      updatedAt: "2023-11-03T11:54:06.246Z"
    },
    {
      id: 9,
      title: "todocreated",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T11:56:51.473Z",
      updatedAt: "2023-11-03T11:56:51.473Z"
    },
    {
      id: 10,
      title: "todocreated",
      description: "new data",
      dueDate: "2023-10-31",
      createdAt: "2023-11-03T11:56:56.432Z",
      updatedAt: "2023-11-03T11:56:56.432Z"
    }
  ];
  test("It will get all the todos till id 10", async () => {
    const response = await request(app)
      .get("/api/v1/todos")
      .set("Authorization", "Bearer abcde12345");

    expect(response.body).toEqual(expectedDbData);
  });

  test("It will get the completed todos in page 1 where limit is 20.", async () => {
    const response = await request(app)
      .get("/api/v1/todos?limit=20&status=completed&page=1")
      .set("Authorization", "Bearer abcde12345");

    expect(response.body).toEqual([
      {
        id: 5,
        title: " sdfsadfasf",
        description: "new data",
        dueDate: "2023-10-31",
        completed: true,
        createdAt: "2023-11-03T09:48:59.875Z",
        updatedAt: "2023-11-03T09:48:59.875Z"
      },
      {
        id: 18,
        title: "todo-newww-18",
        description: "new data",
        dueDate: "2023-10-31",
        completed: true,
        createdAt: "2023-11-08T12:46:16.972Z",
        updatedAt: "2023-11-08T12:46:16.972Z"
      }
    ]);
  });

  test("It will get the completed todos in page 2 where limit is 10.", async () => {
    const response = await request(app)
      .get("/api/v1/todos?limit=10&status=completed&page=2")
      .set("Authorization", "Bearer abcde12345");

    expect(response.body).toEqual([
      {
        id: 18,
        title: "todo-newww-18",
        description: "new data",
        dueDate: "2023-10-31",
        completed: true,
        createdAt: "2023-11-08T12:46:16.972Z",
        updatedAt: "2023-11-08T12:46:16.972Z"
      }
    ]);
  });
  test("It should sort by due date where limit is 5.", async () => {
    const response = await request(app)
      .get("/api/v1/todos/?sort=dueDate&limit=5")
      .set("Authorization", "Bearer abcde12345");

    expect(response.body).toEqual([
      {
        id: 1,
        title: "new on 30 oct",
        description: "Finish the report by 5 PM",
        dueDate: "2023-10-31",
        createdAt: "2023-10-30T05:03:37.524Z",
        updatedAt: "2023-10-30T05:03:37.524Z"
      },
      {
        id: 2,
        title: "2 on 30 oct",
        description: "Finish the report by 5 PM",
        dueDate: "2023-10-31",
        createdAt: "2023-10-30T05:57:50.083Z",
        updatedAt: "2023-10-30T05:57:50.083Z"
      },
      {
        id: 3,
        title: " 4-todos",
        description: "new data",
        dueDate: "2023-10-31",
        createdAt: "2023-11-03T09:48:46.613Z",
        updatedAt: "2023-11-03T09:48:46.613Z"
      },
      {
        id: 4,
        title: " todddddos",
        description: "new data",
        dueDate: "2023-10-31",
        createdAt: "2023-11-03T09:48:54.430Z",
        updatedAt: "2023-11-03T09:48:54.430Z"
      },
      {
        id: 5,
        title: " sdfsadfasf",
        description: "new data",
        dueDate: "2023-10-31",
        completed: true,
        createdAt: "2023-11-03T09:48:59.875Z",
        updatedAt: "2023-11-03T09:48:59.875Z"
      }
    ]);
  });
});
