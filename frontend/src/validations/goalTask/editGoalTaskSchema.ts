import * as yup from "yup";

export const editGoalTaskSchema = yup.object({
  title: yup.string().required("Task title is required"),
});
