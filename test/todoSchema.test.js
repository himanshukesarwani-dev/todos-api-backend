import { expect, describe, it } from "vitest";
import { todoSchema } from "../dist/todoSchema";

describe("todoSchema Validation Unit Test", () => {
  it("validating a valid todo object it should pass the test without any errors", () => {
    const validTodo = {
      id: 1,
      title: "Sample Todo",
      description: "This is a sample todo description.",
      dueDate: "2023-12-31",
      createdAt: "2023-10-31T12:00:00Z",
      updatedAt: "2023-10-31T13:00:00Z",
    };

    const result = todoSchema.safeParse(validTodo);
    expect(result.success).toBe(true);
  });

  it("validating an invalid todo object. It will throw errors ", () => {
    const invalidTodo = {
      id: "invalid",
      title: "s",
      description: "s",
      dueDate: "2023/12/31", // Invalid date format
      createdAt: "2023-10-31T12:00:00Z",
      updatedAt: "invalid", // Invalid date format
    };

    const result = todoSchema.safeParse(invalidTodo);
    console.log(result.error);
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
