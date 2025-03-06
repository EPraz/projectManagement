import * as yup from "yup";

export const createTicketSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
});
