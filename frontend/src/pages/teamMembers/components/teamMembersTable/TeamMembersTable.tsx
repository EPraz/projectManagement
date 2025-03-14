import {
  MemberInfo,
  NoResultsContainer,
  StyledTableCell,
  TableWrapper,
} from "../../TeamMembersPage.styles";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  formatRoleName,
  getRoleColor,
  getStatusColor,
} from "../../../../helpers";
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { TeamMembersTableProps } from "../../../../types";

const TeamMembersTable = ({
  filteredMembers,
  theme,
  handleMenuClick,
  hasActiveFilters,
  searchQuery,
  handleResetFilters,
}: TeamMembersTableProps) => {
  return (
    <TableWrapper elevation={0}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Member</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Projects</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <TableRow
                  key={member.id}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    transition: "background-color 0.2s",
                  }}
                >
                  <StyledTableCell>
                    <MemberInfo>
                      <Avatar
                        src={`/placeholder.svg?height=40&width=40&text=${member.name.charAt(
                          0
                        )}`}
                        alt={member.name}
                        sx={{
                          width: 40,
                          height: 40,
                          border: `2px solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
                          bgcolor: member.role
                            ? getRoleColor(member.role, theme)
                            : undefined,
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                    </MemberInfo>
                  </StyledTableCell>
                  <StyledTableCell>
                    {member.role ? (
                      <Chip
                        label={formatRoleName(member.role)}
                        size="small"
                        sx={{
                          bgcolor: `${getRoleColor(member.role, theme)}14`,
                          color: getRoleColor(member.role, theme),
                          fontWeight: 500,
                        }}
                      />
                    ) : (
                      <Chip
                        label="No Role"
                        size="small"
                        sx={{
                          bgcolor: theme.palette.grey[100],
                          color: theme.palette.grey[600],
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor("Active", theme)}14`,
                        color: getStatusColor("Active", theme),
                        fontWeight: 500,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {member.projects.map((x, index) => (
                      <Chip
                        key={index}
                        label={x.title}
                        size="small"
                        sx={{
                          bgcolor: `${getRoleColor(member.role, theme)}14`,
                          color: getRoleColor(member.role, theme),
                          fontWeight: 500,
                        }}
                      />
                    ))}
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, member.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={4}>
                  <NoResultsContainer>
                    <Typography variant="body1" color="text.secondary">
                      No team members found
                    </Typography>
                    {(hasActiveFilters || searchQuery) && (
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters
                      </Typography>
                    )}
                    {hasActiveFilters && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleResetFilters}
                        startIcon={<CloseIcon />}
                        sx={{ mt: 1 }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </NoResultsContainer>
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </TableWrapper>
  );
};

export default TeamMembersTable;
