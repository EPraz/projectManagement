import * as yup from "yup";
import { Ticket } from "../../types";

export const createTicketSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
}) as yup.ObjectSchema<Partial<Ticket>>;
