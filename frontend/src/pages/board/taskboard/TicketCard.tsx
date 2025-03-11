import React, { memo, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Tooltip,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { Ticket, TicketCardProps } from "../../../types";
import {
  formatStatusName,
  getPriorityColor,
  getTypeIcon,
  truncatedTitle,
} from "../../../helpers";
import {
  MetricItem,
  PriorityChip,
  StyledCard,
  TicketHeader,
  TicketInfo,
  TicketMetrics,
  TicketTitle,
} from "./TaskBoard.styles";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { StatusIndicator } from "../../../components";
import { useSearchParams } from "react-router-dom";

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onChange,
  ticketStatuses,
}) => {
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [_, setSearchParams] = useSearchParams();

  const currentStatus = ticketStatuses?.find(
    (status) => status.id === ticket.statusId
  );

  const handleOpenEdit = (ticket: Ticket) => {
    setSearchParams(
      { tab: "board", ticketId: ticket.id.toString() },
      { replace: true }
    );
  };

  return (
    <StyledCard
      type={ticket.type}
      elevation={0}
      onClick={() => handleOpenEdit(ticket)}
    >
      <TicketInfo>
        <TicketHeader>
          <TicketTitle>
            <Tooltip title={ticket.type} arrow>
              <Box>{getTypeIcon(ticket.type)}</Box>
            </Tooltip>
            <Tooltip title={ticket.title} arrow>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ cursor: "pointer" }}
              >
                {truncatedTitle(ticket.title)}
              </Typography>
            </Tooltip>
          </TicketTitle>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <StatusIndicator
              status={currentStatus?.name || ""}
              color={currentStatus?.color || ""}
            />
            <Select
              value={ticket.statusId}
              onChange={(e) => {
                e.stopPropagation();
                onChange(ticket.id, e.target.value);
              }}
              onOpen={(e) => {
                e.stopPropagation();
                setStatusOpen(true);
              }}
              onClose={() => setStatusOpen(false)}
              open={statusOpen}
              size="small"
              onClick={(e) => e.stopPropagation()}
              disabled={ticket.isBlocked}
              sx={{
                minWidth: 130,
                "& .MuiSelect-select": {
                  paddingTop: 0.5,
                  paddingBottom: 0.5,
                  paddingLeft: 1,
                  paddingRight: 1,
                  fontSize: "0.875rem",
                },
              }}
            >
              {ticketStatuses?.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {formatStatusName(status.name)}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </TicketHeader>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TicketMetrics>
            <Tooltip title="Ticket ID" arrow>
              <MetricItem>
                <Typography variant="caption" fontFamily="monospace">
                  #{ticket.id}
                </Typography>
              </MetricItem>
            </Tooltip>

            {ticket.priority && (
              <Tooltip title="Priority" arrow>
                <MetricItem>
                  {/* <FlagIcon fontSize="small" /> */}
                  <PriorityChip
                    size="small"
                    label={ticket.priority}
                    priorityColor={getPriorityColor(ticket.priority)}
                  />
                  {/* {getTypeIcon(ticket.priority)} */}
                </MetricItem>
              </Tooltip>
            )}

            {ticket.dueDate && (
              <Tooltip title="Due Date" arrow>
                <MetricItem>
                  <CalendarMonthIcon fontSize="small" />
                  <Typography variant="caption">
                    {new Date(ticket.dueDate).toLocaleDateString()}
                  </Typography>
                </MetricItem>
              </Tooltip>
            )}
          </TicketMetrics>

          {ticket.assignedUser ? (
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 24,
                  height: 24,
                  backgroundColor: "secondary.dark",
                },
              }}
            >
              <Tooltip
                key={ticket.assignedUser.id}
                title={ticket.assignedUser.name}
                arrow
              >
                <Avatar
                  src={ticket.assignedUser.email}
                  alt={ticket.assignedUser.name}
                />
              </Tooltip>
            </AvatarGroup>
          ) : (
            <Tooltip title="Unassigned" arrow>
              <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                ?
              </Avatar>
            </Tooltip>
          )}
        </Box>
      </TicketInfo>
    </StyledCard>
  );
};

export default memo(TicketCard);
