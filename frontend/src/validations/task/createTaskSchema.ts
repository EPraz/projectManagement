import * as yup from "yup";
import { Task } from "../../types";

export const createTaskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
}) as yup.ObjectSchema<Partial<Task>>;
