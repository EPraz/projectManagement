import * as yup from "yup";

export const taskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  // createdBy: yup.string().email("Invalid email").required("CreatedBy is required"),
  // ticketId: yup.number().required("Ticket ID is required").min(1, 'Ticket ID 0 is not allowed'),
});
