import * as yup from "yup";
import { Ticket } from "../../types";

export const editTicketSchema: yup.ObjectSchema<Partial<Ticket>> = yup
  .object()
  .shape({
    title: yup
      .string()
      .optional()
      .trim()
      .min(3, "Title must be at least 3 characters"),
    statusId: yup.string().optional().nullable(),
    description: yup.string().optional().nullable(),
    acceptanceCriteria: yup.string().optional().nullable(),
    discussion: yup.string().optional().nullable(),
    sprintId: yup.string().optional().nullable(),
  }) as yup.ObjectSchema<Partial<Ticket>>;
