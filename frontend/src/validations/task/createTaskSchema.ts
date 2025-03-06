import * as yup from "yup";

export const createTaskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
});
