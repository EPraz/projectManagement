import * as yup from "yup";
import { CreateSprintFormData } from "../../types";

export const createSprintSchema: yup.ObjectSchema<CreateSprintFormData> =
  yup.object({
    name: yup
      .string()
      .required("Sprint name is required")
      .min(3, "Minimum 3 characters"),
    startDate: yup
      .date()
      .typeError("Start date must be a valid date")
      .required("Start date is required")
      .transform((value, originalValue) => {
        return originalValue ? new Date(originalValue) : null;
      }),
    endDate: yup
      .date()
      .typeError("End date must be a valid date")
      .required("End date is required")
      .min(yup.ref("startDate"), "End date must be after Start date")
      .transform((value, originalValue) => {
        return originalValue ? new Date(originalValue) : null;
      }),
  });
