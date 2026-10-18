import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import type { TeamMemberCapacity } from "../../../../../types";
import { getInitials } from "../../../../../helpers";
import { computeCompletedWork } from "../CapacityBoard.helpers";
import CapacityProgress from "../CapacityProgress";
import MemberCapacityCard from "../MemberCapacityCard";
type Props = {
  teamMembers: TeamMemberCapacity[];
  handleOpenEditDialog: (record: TeamMemberCapacity) => void;
  handleOpenDeleteModal: (record: TeamMemberCapacity) => void;
  isPending: (id: string) => boolean;
};
export default function CapacityBoardTable({
  teamMembers,
  handleOpenEditDialog,
  handleOpenDeleteModal,
  isPending,
}: Props) {
  const wide = useMediaQuery(useTheme().breakpoints.up("lg"));
  if (!wide)
    return (
      <Box
        role="region"
        aria-label="Member capacity cards"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            sm: "repeat(2,minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        {teamMembers.map((member) => (
          <MemberCapacityCard
            key={member.id}
            member={member}
            pending={isPending(member.id)}
            edit={() => handleOpenEditDialog(member)}
            remove={() => handleOpenDeleteModal(member)}
          />
        ))}
      </Box>
    );
  return (
    <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden" }}>
      <TableContainer
        role="region"
        aria-label="Sprint capacity comparison"
        tabIndex={0}
        sx={{ maxHeight: "74dvh" }}
      >
        <Table
          stickyHeader
          aria-label="Member capacity"
          sx={{ minWidth: 1000 }}
        >
          <TableHead>
            <TableRow>
              {[
                "Team Member",
                "Capacity (hours)",
                "Days Off",
                "Completed work",
                "Progress",
                "Actions",
              ].map((label) => (
                <TableCell
                  key={label}
                  sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: 210,
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: "primary.light", color: "primary.main" }}
                    >
                      {getInitials(member.user?.name ?? "")}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: 16,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {member.user?.name ?? "Unknown member"}
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
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>
                    {member.capacity}h
                  </Typography>
                </TableCell>
                <TableCell>{member.daysOff}</TableCell>
                <TableCell>
                  {computeCompletedWork(member).toFixed(1)}h
                </TableCell>
                <TableCell>
                  <CapacityProgress member={member} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      aria-label="Edit capacity"
                      disabled={isPending(member.id)}
                      onClick={() => handleOpenEditDialog(member)}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="Delete capacity"
                      color="error"
                      disabled={isPending(member.id)}
                      onClick={() => handleOpenDeleteModal(member)}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
