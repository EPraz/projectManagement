import { Header, SearchBar } from "../../ProjectsPage.styles";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  Search,
  Refresh,
  ViewModule,
  ViewList,
  GridView,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { UserMenu } from "../../../../components";
import type { ProjectHeaderProps } from "../../../../types";
import AppearanceControl from "../../../../components/appearanceControl/AppearanceControl";
import StudioMark from "../../../../components/studio/StudioMark";
export default function ProjectHeader({
  refreshing,
  onRefresh,
  searchInput,
  handleSearchChange,
  handleViewChange,
  view,
  canCreateProject,
  setOpenDialog,
}: ProjectHeaderProps) {
  const viewLabel =
    view === "grid" ? "Switch to list view" : "Switch to grid view";
  return (
    <Header>
      <Box
        component="nav"
        aria-label="Workspace"
        sx={{
          display: { xs: "none", md: "flex" },
          position: "fixed",
          top: 22,
          left: 22,
          bottom: 22,
          width: 74,
          bgcolor: "sidebar.background",
          color: "#91b8ff",
          borderRadius: "19px",
          alignItems: "center",
          flexDirection: "column",
          pt: 3,
          gap: 4,
        }}
      >
        <StudioMark />
        <Tooltip title="All projects" placement="right">
          <IconButton
            component={Link}
            to="/projects"
            aria-label="All projects"
            aria-current="page"
            sx={{
              color: "inherit",
              bgcolor: "sidebar.active",
              borderRadius: "8px",
            }}
          >
            <GridView />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          Projects
        </Typography>
        <Chip
          variant="outlined"
          size="small"
          label="Demo workspace"
          sx={{ display: { xs: "none", sm: "flex" } }}
        />
        <AppearanceControl />
        <UserMenu />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mt: { xs: 1, md: 2 },
        }}
      >
        <Box>
          <Typography variant="overline" color="primary">
            Your workspace / Projects
          </Typography>
          <Typography component="h1" variant="h1" sx={{ mt: 0.5, mb: 1 }}>
            Projects
            <Box component="span" sx={{ color: "primary.main" }}>
              .
            </Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A shared space for the work ahead.
          </Typography>
        </Box>
        <Tooltip
          title={
            !canCreateProject
              ? "You need ADMIN or PROJECT_MANAGER role to create projects"
              : ""
          }
        >
          <span>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              disabled={!canCreateProject}
            >
              New Project
            </Button>
          </span>
        </Tooltip>
      </Box>
      <SearchBar>
        <TextField
          size="small"
          placeholder="Search projects..."
          inputProps={{ "aria-label": "Search projects" }}
          value={searchInput}
          onChange={handleSearchChange}
          sx={{ width: { xs: "100%", sm: 340 }, mr: { sm: "auto" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="text"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing…" : "Refresh projects"}
        </Button>
        <Tooltip title={viewLabel}>
          <IconButton
            aria-label={viewLabel}
            onClick={() => handleViewChange(view === "grid" ? "list" : "grid")}
          >
            {view === "grid" ? <ViewList /> : <ViewModule />}
          </IconButton>
        </Tooltip>
      </SearchBar>
    </Header>
  );
}
