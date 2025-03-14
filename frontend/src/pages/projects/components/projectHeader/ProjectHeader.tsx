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
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import { UserMenu } from "../../../../components";
import { ProjectHeaderProps } from "../../../../types";

const ProjectHeader = ({
  searchInput,
  handleSearchChange,
  handleViewChange,
  view,
  canCreateProject,
  setOpenDialog,
}: ProjectHeaderProps) => {
  return (
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
          value={searchInput}
          onChange={handleSearchChange}
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
        <Tooltip
          title={
            view === "grid" ? "Switch to list view" : "Switch to grid view"
          }
        >
          <IconButton
            onClick={() => handleViewChange(view === "grid" ? "list" : "grid")}
            color={view === "grid" ? "primary" : "default"}
          >
            {view === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            !canCreateProject
              ? "You need ADMIN or PROJECT_MANAGER role to create projects"
              : ""
          }
          arrow
        >
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              disabled={!canCreateProject}
            >
              New Project
            </Button>
          </span>
        </Tooltip>
      </SearchBar>
      <UserMenu />
    </Header>
  );
};

export default ProjectHeader;
