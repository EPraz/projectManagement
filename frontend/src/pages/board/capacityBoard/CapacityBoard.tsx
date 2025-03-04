import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TableBody,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  ActionButton,
  BoardContainer,
  Header,
  MemberCell,
  MemberName,
  ProgressCell,
  StyledLinearProgress,
  StyledTable,
  StyledTableContainer,
  TableBodyCell,
  TableHeaderCell,
} from "./CapacityBoard.styles";

interface TeamMemberCapacity {
  id: number;
  name: string;
  avatar: string;
  activity: string;
  capacity: number;
  daysOff: number;
  remainingWork: number;
}

const mockData: TeamMemberCapacity[] = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    activity: "Development",
    capacity: 40,
    daysOff: 2,
    remainingWork: 30,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    activity: "Design",
    capacity: 40,
    daysOff: 1,
    remainingWork: 20,
  },
];

const CapacityBoard = () => {
  const [teamMembers, setTeamMembers] =
    useState<TeamMemberCapacity[]>(mockData);

  return (
    <BoardContainer>
      <Header>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Team Capacity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Jun 11 - Jun 29 · Sprint 1
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            px: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Add team member
        </Button>
      </Header>

      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Team Member</TableHeaderCell>
              <TableHeaderCell>Activity</TableHeaderCell>
              <TableHeaderCell align="right">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 0.5,
                  }}
                >
                  Capacity (hours)
                  <Tooltip
                    title="Total hours available for the sprint"
                    arrow
                    placement="top"
                  >
                    <InfoOutlinedIcon
                      sx={{ fontSize: 16, color: "text.secondary", ml: 0.5 }}
                    />
                  </Tooltip>
                </Box>
              </TableHeaderCell>
              <TableHeaderCell align="right">Days Off</TableHeaderCell>
              <TableHeaderCell>Per Day</TableHeaderCell>
              <TableHeaderCell>Progress</TableHeaderCell>
              <TableHeaderCell align="right">Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => {
              const progress = (member.remainingWork / member.capacity) * 100;
              const perDay =
                (member.capacity - member.remainingWork) /
                (member.daysOff || 1);

              return (
                <TableRow key={member.id} hover>
                  <TableBodyCell>
                    <MemberCell>
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        sx={{ width: 32, height: 32 }}
                      />
                      <MemberName variant="body2">{member.name}</MemberName>
                    </MemberCell>
                  </TableBodyCell>
                  <TableBodyCell>{member.activity}</TableBodyCell>
                  <TableBodyCell align="right">
                    {member.capacity}h
                  </TableBodyCell>
                  <TableBodyCell align="right">{member.daysOff}</TableBodyCell>
                  <TableBodyCell>{perDay.toFixed(1)}h</TableBodyCell>
                  <TableBodyCell>
                    <ProgressCell>
                      <StyledLinearProgress
                        variant="determinate"
                        value={progress}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {member.remainingWork}h
                      </Typography>
                    </ProgressCell>
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    <Tooltip title="Edit member" arrow>
                      <ActionButton size="small">
                        <EditIcon sx={{ fontSize: 18 }} />
                      </ActionButton>
                    </Tooltip>
                  </TableBodyCell>
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </BoardContainer>
  );
};

export default CapacityBoard;
