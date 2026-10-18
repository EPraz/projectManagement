import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Close, FilterList, Search } from "@mui/icons-material";
import { Role } from "../../../../constants";
import { formatRoleName } from "../../../../helpers";
import type { TeamMembersSearchBarProps } from "../../../../types";
export default function TeamMembersSearchBar(props: TeamMembersSearchBarProps) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search members"
          placeholder="Search members..."
          value={props.searchQuery}
          onChange={(event) => props.setSearchQuery(event.target.value)}
          size="small"
          sx={{ flex: "1 1 240px" }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            endAdornment: props.searchQuery ? (
              <IconButton
                aria-label="Clear member search"
                onClick={() => props.setSearchQuery("")}
              >
                <Close fontSize="small" />
              </IconButton>
            ) : undefined,
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={props.handleOpenFilter}
        >
          Filters
          {props.activeFilterCount ? ` (${props.activeFilterCount})` : ""}
        </Button>
        {(props.hasActiveFilters || props.searchQuery) && (
          <Button onClick={props.handleResetFilters}>Clear Filters</Button>
        )}
      </Box>
      <Popover
        open={Boolean(props.filterAnchorEl)}
        anchorEl={props.filterAnchorEl}
        onClose={props.handleCloseFilter}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: "min(360px,calc(100vw - 32px))", borderRadius: "12px" },
        }}
      >
        <Box sx={{ p: 3, display: "grid", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography component="h2" variant="h4" sx={{ flex: 1 }}>
              Member filters
            </Typography>
            <IconButton
              aria-label="Close member filters"
              onClick={props.handleCloseFilter}
            >
              <Close />
            </IconButton>
          </Box>
          <TextField
            label="Member name"
            placeholder="Filter by name"
            fullWidth
            size="small"
            value={props.tempFilters.name}
            onChange={(event) =>
              props.setTempFilters((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
          <TextField
            label="Member email"
            placeholder="Filter by email"
            fullWidth
            size="small"
            value={props.tempFilters.email}
            onChange={(event) =>
              props.setTempFilters((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
          />
          <Box>
            <Typography id="member-role-filter" sx={{ fontWeight: 500, mb: 1 }}>
              Role
            </Typography>
            <FormGroup aria-labelledby="member-role-filter">
              {Object.values(Role).map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={props.tempFilters.roles[role] || false}
                      onChange={() => props.handleRoleFilterChange(role)}
                    />
                  }
                  label={formatRoleName(role)}
                />
              ))}
            </FormGroup>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Button variant="outlined" onClick={props.handleResetFilters}>
              Reset
            </Button>
            <Button variant="contained" onClick={props.handleApplyFilters}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
