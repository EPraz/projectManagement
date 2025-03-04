import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Work as WorkIcon,
  PowerSettingsNew as PowerIcon,
} from "@mui/icons-material";
import {
  Container,
  Header,
  MemberInfo,
  ProjectsContainer,
  SearchBar,
  StyledTableCell,
  TableWrapper,
} from "./TeamMembersPage.styles";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "Active" | "Inactive";
  projects: string[];
}

const mockData: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    projects: ["Project A", "Project B"],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    projects: ["Project C"],
  },
];

const roles = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "product_owner", label: "Product Owner" },
  { value: "scrum_master", label: "Scrum Master" },
];

export default function TeamMembersPage() {
  const theme = useTheme();
  const [members, setMembers] = useState<TeamMember[]>(mockData);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    memberId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedMember(memberId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const getStatusColor = (status: "Active" | "Inactive") => {
    return status === "Active"
      ? theme.palette.success.main
      : theme.palette.grey[500];
  };

  return (
    <Container>
      <Header elevation={0}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Team Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your team members and their roles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ height: 40 }}
        >
          Add Member
        </Button>
      </Header>

      <SearchBar>
        <TextField
          size="small"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{ height: 40 }}
        >
          Filter
        </Button>
      </SearchBar>

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
              {filteredMembers.map((member) => (
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
                        src={member.avatar}
                        alt={member.name}
                        sx={{
                          width: 40,
                          height: 40,
                          border: `2px solid ${theme.palette.background.paper}`,
                          boxShadow: theme.shadows[2],
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
                    <Chip
                      label={member.role}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.primary.main + "14",
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={member.status}
                      size="small"
                      sx={{
                        bgcolor: `${getStatusColor(member.status)}14`,
                        color: getStatusColor(member.status),
                        fontWeight: 500,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <ProjectsContainer>
                      {member.projects.map((project) => (
                        <Chip
                          key={project}
                          label={project}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.grey[100],
                            color: theme.palette.grey[700],
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </ProjectsContainer>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>Edit Member</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>Change Role</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <WorkIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>Manage Projects</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color:
              selectedMember &&
              members.find((m) => m.id === selectedMember)?.status === "Active"
                ? "error.main"
                : "success.main",
          }}
        >
          <PowerIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>
            {selectedMember &&
            members.find((m) => m.id === selectedMember)?.status === "Active"
              ? "Deactivate"
              : "Activate"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          Add Team Member
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField label="Name" fullWidth size="small" />
            <TextField label="Email" fullWidth size="small" type="email" />
            <TextField
              label="Role"
              fullWidth
              size="small"
              select
              defaultValue=""
            >
              <MenuItem value="" disabled>
                Select a role
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
