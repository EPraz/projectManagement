import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  CardContent,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";
import { useApi } from "../../context";
import type { Project } from "../../types";
import { useNavigate } from "react-router-dom";
import { DialogForm } from "../../components";
import { createProjectSchema } from "../../validations";
import { useCreateProject } from "../../hooks";
import {
  EmptyState,
  FavoriteButton,
  Header,
  MetricBox,
  ProjectCard,
  ProjectGrid,
  ProjectStats,
  SearchBar,
} from "./ProjectList.styles";

interface ProjectListProps {
  view?: "grid" | "list";
}

export default function ProjectList({
  view: initialView = "grid",
}: ProjectListProps) {
  const theme = useTheme();
  const { apiUrl } = useApi();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState(initialView);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { createProject, loading: postProjectLoading } = useCreateProject();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/projects/`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async (data: Partial<Project>) => {
    const newProject = await createProject(
      data.title ?? "",
      data?.description ?? ""
    );
    if (newProject) {
      setOpenDialog(false);
      setProjects([...projects, newProject]);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    projectId: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const getProjectProgress = (project: Project) => {
    const totalTickets = project.tickets?.length;
    if (totalTickets === 0) return 0;
    const completedTickets = project.tickets?.filter(
      (ticket) =>
        project.ticketStatuses.find((status) => status.id === ticket.statusId)
          ?.name === "DONE"
    )?.length;
    return Math.round((completedTickets / totalTickets) * 100);
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (a.id === favoriteId) return -1;
        if (b.id === favoriteId) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [projects, searchQuery, favoriteId]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading || postProjectLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Header>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and organize your team projects
          </Typography>
        </Box>

        <SearchBar>
          <TextField
            size="small"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", md: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" startIcon={<FilterListIcon />}>
            Filter
          </Button>
          <IconButton
            onClick={() => setView(view === "grid" ? "list" : "grid")}
          >
            {view === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            New Project
          </Button>
        </SearchBar>
      </Header>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {projects?.length === 0 ? (
        <EmptyState>
          <FolderIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No projects yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first project to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Project
          </Button>
        </EmptyState>
      ) : (
        <ProjectGrid>
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                elevation={0}
                onClick={() => navigate(`/projects/${project.id}/overview`)}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FavoriteButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavoriteId(
                      favoriteId === project.id ? null : project.id
                    );
                  }}
                >
                  {favoriteId === project.id ? (
                    <StarIcon sx={{ color: theme.palette.warning.main }} />
                  ) : (
                    <StarBorderIcon />
                  )}
                </FavoriteButton>

                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {project.description || "No description available"}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        gutterBottom
                      >
                        Progress
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={getProjectProgress(project)}
                          sx={{ flex: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getProjectProgress(project)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <MetricBox>
                      <AssignmentIcon className="icon" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tickets
                        </Typography>
                        <Typography variant="subtitle2">
                          {project.tickets?.length}
                        </Typography>
                      </Box>
                    </MetricBox>

                    <MetricBox>
                      <SpeedIcon className="icon" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Sprints
                        </Typography>
                        <Typography variant="subtitle2">
                          {project.sprints?.length}
                        </Typography>
                      </Box>
                    </MetricBox>

                    <MetricBox>
                      <GroupIcon className="icon" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Team
                        </Typography>
                        <Typography variant="subtitle2">
                          {project.users?.length}
                        </Typography>
                      </Box>
                    </MetricBox>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <AvatarGroup
                      max={4}
                      sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
                    >
                      {project.users.map((user) => (
                        <Tooltip key={user.id} title={user.user.name}>
                          <Avatar src={user.user.email} alt={user.user.name} />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, project.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </CardContent>

                <ProjectStats>
                  <Typography variant="caption" color="text.secondary">
                    Created by {project.createdBy} •{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>
                  {project.updatedBy && (
                    <Typography variant="caption" color="text.secondary">
                      Updated by {project.updatedBy}
                    </Typography>
                  )}
                </ProjectStats>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>
      )}

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
        <MenuItem onClick={handleMenuClose}>Edit Project</MenuItem>
        <MenuItem onClick={handleMenuClose}>Manage Team</MenuItem>
        <MenuItem onClick={handleMenuClose}>Project Settings</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Delete Project
        </MenuItem>
      </Menu>

      {openDialog && (
        <DialogForm
          open={openDialog}
          title="Create Project"
          onClose={() => setOpenDialog(false)}
          onSubmit={handleCreateProject}
          schema={createProjectSchema}
          disabled={postProjectLoading}
          defaultValues={{
            title: "",
            description: "",
          }}
        />
      )}
    </Container>
  );
}
