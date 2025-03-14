import {
  ActiveFilterCountBox,
  FilterActions,
  FilterButton,
  FilterContainer,
  FilterHeader,
  FilterSection,
  SearchBar,
} from "../../TeamMembersPage.styles";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";

import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  FilterAlt as FilterAltIcon,
} from "@mui/icons-material";
import { Role } from "../../../../constants";
import { formatRoleName, getRoleColor } from "../../../../helpers";
import { TeamMembersSearchBarProps } from "../../../../types";

const TeamMembersSearchBar = ({
  searchQuery,
  setSearchQuery,
  handleOpenFilter,
  hasActiveFilters,
  activeFilterCount,
  filterAnchorEl,
  handleCloseFilter,
  tempFilters,
  setTempFilters,
  handleRoleFilterChange,
  theme,
  handleResetFilters,
  handleApplyFilters,
}: TeamMembersSearchBarProps) => {
  return (
    <SearchBar>
      <TextField
        size="small"
        placeholder="Search members..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: { xs: "100%", sm: 300 } }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
        }}
      />
      <FilterButton
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleOpenFilter}
        hasActiveFilters={hasActiveFilters}
      >
        Filter
        {activeFilterCount > 0 && (
          <ActiveFilterCountBox>{activeFilterCount}</ActiveFilterCountBox>
        )}
      </FilterButton>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 320,
            p: 0,
            mt: 1,
            overflow: "hidden",
            boxShadow: 4,
            borderRadius: 2,
          },
        }}
      >
        <FilterContainer>
          <FilterHeader>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FilterAltIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Filters
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleCloseFilter}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </FilterHeader>

          <FilterSection>
            <Typography variant="subtitle2" gutterBottom>
              Member Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Filter by name"
              value={tempFilters.name}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" gutterBottom>
              Email
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Filter by email"
              value={tempFilters.email}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </FilterSection>

          <FilterSection>
            <Typography variant="subtitle2" gutterBottom>
              Role
            </Typography>
            <FormGroup>
              {Object.values(Role).map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={tempFilters.roles[role] || false}
                      onChange={() => handleRoleFilterChange(role)}
                      size="small"
                      sx={{
                        color: getRoleColor(role, theme),
                        "&.Mui-checked": {
                          color: getRoleColor(role, theme),
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {formatRoleName(role)}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </FilterSection>

          <Divider />

          <FilterActions>
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFilters}
              startIcon={<CloseIcon />}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </FilterActions>
        </FilterContainer>
      </Popover>
    </SearchBar>
  );
};

export default TeamMembersSearchBar;
