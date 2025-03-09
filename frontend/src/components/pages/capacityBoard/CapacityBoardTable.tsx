import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material";
import {
  ActionButton,
  MemberCell,
  MemberName,
  ProgressCell,
  StyledLinearProgress,
  StyledTable,
  StyledTableContainer,
  TableBodyCell,
  TableHeaderCell,
} from "./CapacityBoard.styles";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { computePerDay, computeProgress } from "./CapacityBoard.helpers";
import { getInitials } from "../../../helpers";
import { TeamMemberCapacity } from "../../../types";

type CapacityBoardTableProps = {
  teamMembers: TeamMemberCapacity[];
  handleOpenEditDialog: (record: TeamMemberCapacity) => void;
  handleOpenDeleteModal: (record: TeamMemberCapacity) => void;
};

const CapacityBoardTable = ({
  teamMembers,
  handleOpenEditDialog,
  handleOpenDeleteModal,
}: CapacityBoardTableProps) => {
  return (
    <StyledTableContainer>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
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
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                        ml: 0.5,
                      }}
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
              const progress = computeProgress(member);
              const perDay = computePerDay(member);
              return (
                <TableRow key={member.id} hover>
                  <TableBodyCell>
                    <MemberCell>
                      <Avatar
                        alt={member.user?.name || "Team member"}
                        src={`/placeholder.svg?height=40&width=40&text=${getInitials(
                          member.user?.name || ""
                        )}`}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "primary.main",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {member.user ? getInitials(member.user.name) : ""}
                      </Avatar>
                      <Box>
                        <MemberName variant="body2">
                          {member.user?.name || "Unknown"}
                        </MemberName>
                        <Typography variant="caption" color="text.secondary">
                          {member.user?.email || ""}
                        </Typography>
                      </Box>
                    </MemberCell>
                  </TableBodyCell>
                  <TableBodyCell>
                    <Chip
                      label="Development"
                      size="small"
                      sx={{
                        bgcolor: "secondary.light",
                        color: "secondary.dark",
                        fontWeight: 500,
                      }}
                    />
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ color: "primary.main" }}
                    >
                      {member.capacity}h
                    </Typography>
                  </TableBodyCell>
                  <TableBodyCell align="right">
                    <Chip
                      label={member.daysOff}
                      size="small"
                      sx={{
                        minWidth: 30,
                        bgcolor: "background.default",
                      }}
                    />
                  </TableBodyCell>
                  <TableBodyCell>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ color: "secondary.main" }}
                    >
                      {perDay.toFixed(1)}h
                    </Typography>
                  </TableBodyCell>
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
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Tooltip title="Edit member" arrow>
                        <ActionButton
                          size="small"
                          onClick={() => handleOpenEditDialog(member)}
                        >
                          <EditIcon sx={{ color: "secondary.main" }} />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Delete member" arrow>
                        <ActionButton
                          size="small"
                          onClick={() => handleOpenDeleteModal(member)}
                        >
                          <DeleteIcon sx={{ color: "error.main" }} />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableBodyCell>
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </StyledTableContainer>
  );
};

export default CapacityBoardTable;
