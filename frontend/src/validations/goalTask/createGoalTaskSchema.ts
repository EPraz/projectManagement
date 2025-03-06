import * as yup from "yup";

export const createGoalTaskSchema = yup.object({
  title: yup.string().required("Task title is required"),
});
