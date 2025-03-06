import * as yup from "yup";
import { SprintGoal } from "../../types";

export const createSprintGoalSchema: yup.ObjectSchema<Partial<SprintGoal>> =
  yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().optional(),
  }) as yup.ObjectSchema<Partial<SprintGoal>>;
