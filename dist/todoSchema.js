/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/semi */
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
