import * as yup from "yup";
import { Task } from "../../types";

export const editTaskSchema: yup.ObjectSchema<Partial<Task>> = yup.object({
  id: yup.number().required("Task ID is required"),

  title: yup
    .string()
    .optional()
    .trim()
    .min(3, "Title must be at least 3 characters"),

  statusId: yup.string().optional().nullable(),

  description: yup.string().optional().nullable(),

  acceptanceCriteria: yup.string().optional().nullable(),

  discussion: yup.string().optional().nullable(),

  updatedBy: yup
    .string()
    .email("Invalid email format")
    .required("UpdatedBy is required"),

  ticketId: yup.number().optional(),
}) as yup.ObjectSchema<Partial<Task>>;
