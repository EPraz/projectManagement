import * as yup from "yup";
import { RetroTypes } from "../../constants";
import { RetroCard } from "../../types";

export const retrospectiveSchema = yup.object({
  content: yup.string().required("Content is required"),
  type: yup
    .string()
    .oneOf(
      [RetroTypes.POSITIVE, RetroTypes.NEGATIVE, RetroTypes.IMPROVEMENT],
      "Type must be either POSITIVE or NEGATIVE or IMPROVEMENT"
    )
    .required("Type is required"),
}) as yup.ObjectSchema<Partial<RetroCard>>;
