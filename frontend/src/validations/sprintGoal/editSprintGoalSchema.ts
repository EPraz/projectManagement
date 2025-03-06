import * as yup from "yup";
import { SprintGoal } from "../../types";

export const editSprintGoalSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  goalsStatus: yup
    .string()
    .oneOf(["COMPLETED", "IN_PROGRESS", "AT_RISK"])
    .required(),
}) as yup.ObjectSchema<Partial<SprintGoal>>;
