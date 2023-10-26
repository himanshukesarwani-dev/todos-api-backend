/* eslint-disable indent */
import { z } from "zod";

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export { todoSchema };
