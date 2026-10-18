import { Box, Chip, Divider, Typography } from "@mui/material";
import type { Ticket, TicketStatus, User } from "../../types";
import { formatStatusName } from "../../helpers";
export default function TicketSummary({
  draft,
  ticket,
  statuses,
  users,
}: {
  draft: Partial<Ticket>;
  ticket: Ticket | null;
  statuses?: TicketStatus[];
  users?: User[];
}) {
  const status = statuses?.find((status) => status.id === draft.statusId);
  const member = users?.find((user) => user.id === draft.assignedTo);
  return (
    <Box
      component="aside"
      aria-label="Ticket summary"
      sx={{
        display: { xs: "none", md: "block" },
        bgcolor: "background.default",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        alignSelf: "start",
      }}
    >
      <Typography variant="overline" color="primary">
        Ticket context
      </Typography>
      <Typography sx={{ mt: 1, overflowWrap: "anywhere" }} fontWeight={500}>
        {draft.title || "Untitled ticket"}
      </Typography>
      <Chip
        label={formatStatusName(status?.name || "New")}
        size="small"
        variant="outlined"
        sx={{ my: 2 }}
      />
      <Typography variant="body2" color="text.secondary">
        Responsible member
      </Typography>
      <Typography variant="body2">{member?.name || "Unassigned"}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Task completion
      </Typography>
      <Typography>
        {ticket?.tasks.filter((task) => task.status?.name === "DONE").length ??
          0}{" "}
        / {ticket?.tasks.length ?? 0}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Ticket hours remaining
      </Typography>
      <Typography>
        {draft.remainingHours != null
          ? `${draft.remainingHours} h`
          : "Not estimated"}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2 }}
      >
        Changes are shared after Save confirms them.
      </Typography>
    </Box>
  );
}
