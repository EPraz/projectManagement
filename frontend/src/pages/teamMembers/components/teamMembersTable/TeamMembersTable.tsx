import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
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
import { MoreVert } from "@mui/icons-material";
import { formatRoleName, getInitials } from "../../../../helpers";
import type { TeamMembersTableProps, User } from "../../../../types";
export default function TeamMembersTable({
  filteredMembers,
  handleMenuClick,
  hasActiveFilters,
  searchQuery,
  handleResetFilters,
}: TeamMembersTableProps) {
  const wide = useMediaQuery(useTheme().breakpoints.up("md"));
  const identity = (member: User) => (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "start", minWidth: 0 }}>
      <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
        {getInitials(member.name)}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ fontSize: 16, fontWeight: 600, overflowWrap: "anywhere" }}
        >
          {member.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflowWrap: "anywhere" }}
        >
          {member.email}
        </Typography>
      </Box>
    </Box>
  );
  const role = (member: User) => (
    <Chip
      size="small"
      label={member.role ? formatRoleName(member.role) : "No Role"}
    />
  );
  const projects = (member: User) => (
    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
      {member.projects?.map((project) => (
        <Chip
          key={project.id}
          label={project.title}
          size="small"
          sx={{
            maxWidth: "100%",
            height: "auto",
            "& .MuiChip-label": {
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              py: 0.5,
            },
          }}
        />
      ))}
    </Box>
  );
  const action = (member: User) => (
    <IconButton
      aria-label={`Actions for ${member.name}`}
      onClick={(event) => handleMenuClick(event, member.id)}
    >
      <MoreVert />
    </IconButton>
  );
  if (!filteredMembers.length)
    return (
      <Alert severity="info">
        <Typography>No team members found</Typography>
        {(hasActiveFilters || searchQuery) && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        )}
        {(hasActiveFilters || searchQuery) && (
          <Button onClick={handleResetFilters}>Clear Filters</Button>
        )}
      </Alert>
    );
  if (!wide)
    return (
      <Box
        role="region"
        aria-label="Project member cards"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            sm: "repeat(2,minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        {filteredMembers.map((member) => (
          <Paper
            component="article"
            aria-label={member.name}
            variant="outlined"
            key={member.id}
            sx={{ p: 2, borderRadius: "12px", minWidth: 0 }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "start" }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>{identity(member)}</Box>
              {action(member)}
            </Box>
            <Box sx={{ mt: 2 }}>{role(member)}</Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 3, mb: 1 }}
            >
              Projects
            </Typography>
            {projects(member)}
          </Paper>
        ))}
      </Box>
    );
  return (
    <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden" }}>
      <TableContainer
        role="region"
        aria-label="Project membership"
        tabIndex={0}
        sx={{ maxHeight: "74dvh" }}
      >
        <Table stickyHeader aria-label="Project members" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              {["Member", "Role", "Projects", "Actions"].map((label) => (
                <TableCell key={label} sx={{ fontWeight: 600 }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell sx={{ minWidth: 230 }}>{identity(member)}</TableCell>
                <TableCell>{role(member)}</TableCell>
                <TableCell sx={{ maxWidth: 350 }}>{projects(member)}</TableCell>
                <TableCell>{action(member)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
