import { Header, SearchBar } from "../../ProjectsPage.styles";
import {
  Box,
  Button,
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
import type { ProjectHeaderProps } from "../../../../types";
import MobileHeader from "../../../../components/header/Header";
import StudioRail from "../../../../components/studio/StudioRail";
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
      <StudioRail label="Workspace navigation">
        <Tooltip title="All projects" placement="right">
          <IconButton
            component={Link}
            to="/projects"
            aria-label="All projects"
            aria-current="page"
            sx={{
              display: "flex",
              mx: "auto",
              color: "inherit",
              bgcolor: "sidebar.active",
              borderRadius: "8px",
            }}
          >
            <GridView />
          </IconButton>
        </Tooltip>
      </StudioRail>
      <MobileHeader />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
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
