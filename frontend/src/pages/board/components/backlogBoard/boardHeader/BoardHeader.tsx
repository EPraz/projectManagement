import { useState } from "react";
import { Box, Button, FormControlLabel, Menu, Switch } from "@mui/material";
import { ViewColumn } from "@mui/icons-material";
import type { BoardHeaderProps } from "../../../../../types";
import { initialBacklogColumns } from "../../../../../constants";
import WorkFilters from "../../workFilters/WorkFilters";
export default function BoardHeader({
  columns,
  visibleColumns,
  setVisibleColumns,
  filters,
  setFilters,
  project,
}: BoardHeaderProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <Box>
      <WorkFilters
        scope="ticket"
        filters={filters}
        setFilters={setFilters}
        project={project}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ViewColumn />}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          Column Options
        </Button>
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <Box sx={{ p: 2, width: "min(340px,calc(100vw - 32px))" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            <Button
              size="small"
              onClick={() =>
                setVisibleColumns(columns.map((column) => column.key))
              }
            >
              Show All
            </Button>
            <Button size="small" onClick={() => setVisibleColumns([])}>
              Hide All
            </Button>
            <Button
              size="small"
              onClick={() => setVisibleColumns(initialBacklogColumns)}
            >
              Reset
            </Button>
          </Box>
          {columns.map((column) => (
            <FormControlLabel
              key={column.key}
              sx={{ display: "flex", m: 0, justifyContent: "space-between" }}
              labelPlacement="start"
              label={column.label}
              control={
                <Switch
                  inputProps={{ "aria-label": `Show ${column.label} column` }}
                  checked={visibleColumns.includes(column.key)}
                  onChange={() =>
                    setVisibleColumns(
                      visibleColumns.includes(column.key)
                        ? visibleColumns.filter((key) => key !== column.key)
                        : [...visibleColumns, column.key],
                    )
                  }
                />
              }
            />
          ))}
        </Box>
      </Menu>
    </Box>
  );
}
