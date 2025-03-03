import type React from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Popover,
  Menu,
  MenuItem,
  Typography,
  Switch,
} from "@mui/material";
import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import {
  initialBacklogColumns,
  TicketPriority,
  TicketType,
} from "../../../constants";
import type { BoardHeaderProps } from "../../../types";
import {
  ColumnToggleContainer,
  ColumnToggleHeader,
  ColumnToggleItem,
  FilterContainer,
  FilterLabel,
  HeaderContainer,
  StyledSelect,
} from "./BacklogBoard.styles";

const BoardHeader: React.FC<BoardHeaderProps> = ({
  columns,
  visibleColumns,
  setVisibleColumns,
  filters,
  setFilters,
}) => {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [columnAnchor, setColumnAnchor] = useState<null | HTMLElement>(null);

  const handleShowAll = () => {
    setVisibleColumns(columns.map((col) => col.key));
  };

  const handleReset = () => {
    setVisibleColumns(initialBacklogColumns);
  };

  const handleHideAll = () => {
    setVisibleColumns([]);
  };

  return (
    <HeaderContainer>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Filter">
          <IconButton
            size="small"
            onClick={(e) => setFilterAnchor(e.currentTarget)}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Column Options">
          <IconButton
            size="small"
            onClick={(e) => setColumnAnchor(e.currentTarget)}
          >
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>

        <Popover
          open={Boolean(filterAnchor)}
          anchorEl={filterAnchor}
          onClose={() => setFilterAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <FilterContainer>
            <Box>
              <FilterLabel>Priority:</FilterLabel>
              <StyledSelect
                value={filters.priority || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priority: e.target.value as TicketPriority,
                  })
                }
                size="small"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(TicketPriority).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </StyledSelect>
            </Box>

            {/* <Box>
              <FilterLabel>Status:</FilterLabel>
              <StyledSelect
                value={filters.statusId.id || ""}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                size="small"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                {project?.ticketStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.name}>
                    {status.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            </Box> */}

            <Box>
              <FilterLabel>Type:</FilterLabel>
              <StyledSelect
                value={filters.type || ""}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value as TicketType })
                }
                size="small"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                {Object.values(TicketType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </StyledSelect>
            </Box>

            {/* <Box>
              <FilterLabel>Assigned To:</FilterLabel>
              <StyledSelect
                value={filters.assignedUser?.email || ""}
                onChange={(e) =>
                  setFilters({ ...filters, assignedUser: e.target.value })
                }
                size="small"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                {project?.users.map((projectUser) => (
                  <MenuItem
                    key={projectUser.user.email}
                    value={projectUser.user.email}
                  >
                    {projectUser.user.name}
                  </MenuItem>
                ))}
              </StyledSelect>
            </Box> */}

            <Box>
              <FilterLabel>Blocked:</FilterLabel>
              <StyledSelect
                value={filters.isBlocked?.toString() || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    isBlocked: e.target.value === "true",
                  })
                }
                size="small"
                displayEmpty
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Blocked</MenuItem>
                <MenuItem value="false">Not Blocked</MenuItem>
              </StyledSelect>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setFilters({})}
              sx={{ mt: 1 }}
            >
              Reset Filters
            </Button>
          </FilterContainer>
        </Popover>

        <Menu
          anchorEl={columnAnchor}
          open={Boolean(columnAnchor)}
          onClose={() => setColumnAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <ColumnToggleContainer>
            <ColumnToggleHeader>
              <Button size="small" onClick={handleShowAll}>
                Show All
              </Button>
              <Button size="small" onClick={handleHideAll}>
                Hide All
              </Button>
              <Button size="small" onClick={handleReset}>
                Reset
              </Button>
            </ColumnToggleHeader>

            {columns.map((col) => (
              <ColumnToggleItem key={col.key}>
                <Typography variant="body2">{col.label}</Typography>
                <Switch
                  size="small"
                  checked={visibleColumns.includes(col.key)}
                  onChange={() => {
                    const newColumns = visibleColumns.includes(col.key)
                      ? visibleColumns.filter((c) => c !== col.key)
                      : [...visibleColumns, col.key];
                    setVisibleColumns(newColumns);
                  }}
                />
              </ColumnToggleItem>
            ))}
          </ColumnToggleContainer>
        </Menu>
      </Box>
    </HeaderContainer>
  );
};

export default BoardHeader;
