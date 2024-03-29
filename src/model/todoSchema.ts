import { z } from "zod";

const todoSchema = z.object({
  id: z
    .number({
      required_error: "Id is required",
      invalid_type_error: "Id must be a integer",
    })
    .int(),
  title: z
    .string()
    .min(2, "Title must be minimum 2 characters long.")
    .max(20, "Title must be maximum of 20 characters."),
  description: z
    .string()
    .min(5, "Description must be minimum 5 characters long.")
    .max(30, "Description must be maximum of 30 characters."),

  dueDate: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    // eslint-disable-next-line prettier/prettier
    "Due Date must be in the format 'YYYY-MM-DD'.",
  ),
  completed: z
    .boolean()
    .default(false)
    .refine((value) => typeof value === "boolean", {
      message: "completed can only be a boolean",
    }),

  createdAt: z.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, "Invalid date format for createdAt."),
  updatedAt: z.string().refine((value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, "Invalid date format for updatedAt."),
});

export { todoSchema };
