import * as yup from "yup";

export const createProjectSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title cannot exceed 50 characters")
    .required("Title is required"),
  description: yup
    .string()
    .optional()
    .trim()
    .max(200, "Description cannot exceed 200 characters"),
});
