import { Box, ButtonBase, Chip, Typography } from "@mui/material";
import { LockOutlined, ChevronRight } from "@mui/icons-material";
import type { Sprint, Ticket } from "../../../../types";
import { getBlockedTickets } from "../../overviewMetrics";
import OverviewPanel from "../OverviewPanel";
export default function BlockersAndImpediments({
  sprint,
  onOpen,
}: {
  sprint?: Sprint | null;
  onOpen: (ticket: Ticket) => void;
}) {
  const blocked = getBlockedTickets(sprint?.tickets ?? []);
  return (
    <OverviewPanel
      title="Needs attention"
      action={
        sprint && (
          <Chip
            size="small"
            color={blocked.length ? "error" : "default"}
            variant="outlined"
            label={`${blocked.length} blocked`}
          />
        )
      }
    >
      {!sprint ? (
        <Typography color="text.secondary" variant="body2">
          Select a sprint to see attention items.
        </Typography>
      ) : !blocked.length ? (
        <Typography color="text.secondary" variant="body2">
          No blocked tickets in this sprint.
        </Typography>
      ) : (
        <>
          {blocked.slice(0, 4).map((ticket) => (
            <ButtonBase
              key={ticket.id}
              aria-label={`Open ticket #${ticket.id} ${ticket.title}`}
              onClick={() => onOpen(ticket)}
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "flex-start",
                textAlign: "left",
                gap: 1.5,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <LockOutlined sx={{ color: "error.main", fontSize: 21 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {ticket.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  #{ticket.id} ·{" "}
                  {ticket.blockedBy
                    ? `Blocked by #${ticket.blockedBy}`
                    : ticket.isBlocked
                      ? "Marked blocked"
                      : "Blocked ticket state"}
                </Typography>
              </Box>
              <ChevronRight sx={{ fontSize: 18 }} />
            </ButtonBase>
          ))}
          {blocked.length > 4 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2 }}
            >
              Showing 4 of {blocked.length} blocked tickets. All remain
              available in the Taskboard.
            </Typography>
          )}
        </>
      )}
    </OverviewPanel>
  );
}
