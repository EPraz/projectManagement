import * as yup from "yup";

export const ticketSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  createdBy: yup.string().email("Invalid email").required("CreatedBy is required"),
  sprintId: yup.string().optional(),
});
