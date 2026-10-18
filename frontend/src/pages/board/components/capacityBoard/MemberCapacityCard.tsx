import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { DeleteOutline, EditOutlined, ExpandMore } from "@mui/icons-material";
import type { TeamMemberCapacity } from "../../../../types";
import { getInitials } from "../../../../helpers";
import { computeCompletedWork } from "./CapacityBoard.helpers";
import CapacityProgress from "./CapacityProgress";
export default function MemberCapacityCard({
  member,
  edit,
  remove,
  pending,
}: {
  member: TeamMemberCapacity;
  edit: () => void;
  remove: () => void;
  pending: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = member.user?.name ?? "Unknown member";
  return (
    <Paper
      component="article"
      aria-label={name}
      variant="outlined"
      sx={{ p: 2, borderRadius: "12px", minWidth: 0 }}
    >
      <Box sx={{ display: "flex", alignItems: "start", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
          {getInitials(name)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="h3"
            sx={{ fontSize: 18, fontWeight: 600, overflowWrap: "anywhere" }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflowWrap: "anywhere" }}
          >
            {member.user?.email}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          mt: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 600 }}>
            {member.capacity}h
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sprint capacity
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <IconButton
            aria-label="Edit capacity"
            onClick={edit}
            disabled={pending}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Delete capacity"
            color="error"
            onClick={remove}
            disabled={pending}
          >
            <DeleteOutline fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Button
        endIcon={
          <ExpandMore
            sx={{ transform: expanded ? "rotate(180deg)" : undefined }}
          />
        }
        aria-label={`${expanded ? "Hide" : "Show"} capacity details for ${name}`}
        aria-expanded={expanded}
        aria-controls={`capacity-${member.id}`}
        onClick={() => setExpanded((value) => !value)}
        sx={{ mt: 1, width: "100%", justifyContent: "space-between" }}
      >
        {member.remainingWork}h remaining
      </Button>
      <Collapse in={expanded} unmountOnExit>
        <Box
          id={`capacity-${member.id}`}
          sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Box
            component="dl"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: 2,
              m: 0,
              mb: 3,
            }}
          >
            {[
              ["Days Off", `${member.daysOff} days`],
              ["Completed work", `${computeCompletedWork(member).toFixed(1)}h`],
            ].map(([label, value]) => (
              <Box key={label}>
                <Typography
                  component="dt"
                  variant="body2"
                  color="text.secondary"
                >
                  {label}
                </Typography>
                <Typography
                  component="dd"
                  sx={{ m: 0, fontSize: 18, fontWeight: 500 }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
          <CapacityProgress member={member} />
        </Box>
      </Collapse>
    </Paper>
  );
}
