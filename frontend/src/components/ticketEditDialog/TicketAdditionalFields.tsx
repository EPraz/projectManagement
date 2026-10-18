import { Box, Chip, TextField, Typography } from "@mui/material";
import type { Ticket } from "../../types";
import type { TicketFieldProps } from "./types";
const fields = [
  {
    name: "acceptanceCriteria",
    label: "Acceptance Criteria",
    placeholder: "Define what makes this ticket complete...",
  },
  {
    name: "designInformation",
    label: "Design Information",
    placeholder: "Add design details, links to mockups, etc...",
  },
  {
    name: "additionalDetails",
    label: "Additional Details",
    placeholder: "Any other relevant information...",
  },
  { name: "notes", label: "Notes", placeholder: "Add notes..." },
  {
    name: "discussion",
    label: "Discussion",
    placeholder: "Add discussion points...",
  },
] as const;
export default function TicketAdditionalFields({
  draft,
  disabled,
  change,
  ticket,
}: TicketFieldProps & { ticket: Ticket | null }) {
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      {fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          placeholder={field.placeholder}
          value={draft[field.name] ?? ""}
          onChange={(event) => change({ [field.name]: event.target.value })}
          fullWidth
          multiline
          rows={3}
          disabled={disabled}
        />
      ))}
      {ticket && (
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}>
          <Typography component="h3" variant="h4" sx={{ mb: 1 }}>
            Additional information
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflowWrap: "anywhere" }}
          >
            Created by {ticket.createdBy}
            {Number.isFinite(Date.parse(ticket.createdAt))
              ? ` · ${new Date(ticket.createdAt).toLocaleString()}`
              : ""}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflowWrap: "anywhere" }}
          >
            Last updated{" "}
            {Number.isFinite(Date.parse(ticket.updatedAt))
              ? new Date(ticket.updatedAt).toLocaleString()
              : "Not recorded"}
            {ticket.updatedBy ? ` · ${ticket.updatedBy}` : ""}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tags
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {ticket.tags?.length ? (
              ticket.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography variant="body2">No tags</Typography>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Pair programming
          </Typography>
          <Typography variant="body2">
            {ticket.pairProgrammingUsers?.map((user) => user.name).join(", ") ||
              "No members recorded"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
