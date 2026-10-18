import { useState } from "react";
import { Box, ButtonBase, Tabs, Tab, Typography } from "@mui/material";
import type { Sprint, Ticket } from "../../../../types";
import { getTicketDeadlines } from "../../overviewMetrics";
import OverviewPanel from "../OverviewPanel";
export default function UpcomingDeadlines({
  sprint,
  onOpen,
}: {
  sprint?: Sprint | null;
  onOpen: (ticket: Ticket) => void;
}) {
  const { overdue, upcoming } = getTicketDeadlines(sprint?.tickets ?? []);
  const [tab, setTab] = useState(overdue.length ? 0 : 1);
  const shown = tab === 0 ? overdue : upcoming;
  return (
    <OverviewPanel title="On the calendar">
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="fullWidth"
        sx={{ mb: 1 }}
      >
        <Tab label={`Overdue · ${overdue.length}`} />
        <Tab label={`Upcoming · ${upcoming.length}`} />
      </Tabs>
      {!sprint ? (
        <Typography variant="body2" color="text.secondary">
          Select a sprint to see its deadlines.
        </Typography>
      ) : !shown.length ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          {tab === 0
            ? "No overdue unfinished tickets."
            : "No upcoming unfinished tickets."}
        </Typography>
      ) : (
        shown.slice(0, 4).map((ticket) => (
          <ButtonBase
            key={ticket.id}
            onClick={() => onOpen(ticket)}
            aria-label={`Open ticket #${ticket.id} ${ticket.title}`}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              textAlign: "left",
              width: "100%",
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                bgcolor: tab === 0 ? "error.light" : "primary.light",
                color: tab === 0 ? "error.main" : "primary.main",
                borderRadius: 1,
                p: 0.5,
                textAlign: "center",
                width: 44,
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: 11 }}>
                {new Date(ticket.dueDate!).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </Typography>
              <Typography sx={{ fontSize: 22 }}>
                {new Date(ticket.dueDate!).getDate()}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ overflowWrap: "anywhere" }}
              >
                {ticket.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tab === 0 ? "Overdue" : "Upcoming"} ·{" "}
                {new Date(ticket.dueDate!).toLocaleDateString()}
              </Typography>
            </Box>
          </ButtonBase>
        ))
      )}
      {shown.length > 4 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 2 }}
        >
          Showing 4 of {shown.length} deadlines.
        </Typography>
      )}
    </OverviewPanel>
  );
}
