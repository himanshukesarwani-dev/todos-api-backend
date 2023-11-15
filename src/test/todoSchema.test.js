import { expect, describe, test } from "vitest";
import { todoSchema } from "../model/todoSchema";

describe("todoSchema Validation Unit Test", () => {
  test("validating a valid todo object it should pass the test without any errors", () => {
    const validTodo = {
      id: 35,
      title: "Test Todo",
      description: "This is a test todo.",
      dueDate: "2023-12-31",
      completed: false,
      createdAt: "2023-11-10T13:04:14.646Z",
      updatedAt: "2023-11-10T13:04:14.646Z"
    };

    const result = todoSchema.safeParse(validTodo);
    expect(result.success).toBe(true);
  });

  test("validating an invalid todo object. It will throw errors ", () => {
    const invalidTodo = {
      id: "invalid",
      title: "s",
      description: "s",
      dueDate: "2023/12/31", // Invalid date format
      createdAt: "2023-10-31T12:00:00Z",
      updatedAt: "invalid" // Invalid date format
    };

    const result = todoSchema.safeParse(invalidTodo);
    expect(result.success).toBe(false);
    expect(result.error.message).toContain("Id must be a integer");
    expect(result.error.message).toContain(
      "Title must be minimum 2 characters long."
    );
    expect(result.error.message).toContain(
      "Description must be minimum 5 characters long."
    );
    expect(result.error.message).toContain(
      "Due Date must be in the format 'YYYY-MM-DD'."
    );
    expect(result.error.message).toContain(
      "Invalid date format for updatedAt."
    );
  });
});
