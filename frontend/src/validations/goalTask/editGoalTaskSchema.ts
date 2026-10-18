import * as yup from "yup";

export const editGoalTaskSchema = yup.object({
  title: yup.string().trim().required("Task title is required")
});
