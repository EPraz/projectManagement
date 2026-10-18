import type { ReactNode } from "react";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ChevronRight,
  ExpandMore,
  LayersOutlined,
  AccountTreeOutlined,
  EditOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import { formatStatusName } from "../../helpers";
import type { HierarchyKind } from "./types";
export type HierarchyItem = {
  id: string;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  status?: { id: string; name?: string };
  epicId?: string;
};
export default function HierarchyCard({
  item,
  kind,
  onEdit,
  onDelete,
  onExpand,
  expanded,
  count,
  children,
}: {
  item: HierarchyItem;
  kind: HierarchyKind;
  onEdit: () => void;
  onDelete: () => void;
  onExpand?: () => void;
  expanded?: boolean;
  count: string;
  children?: ReactNode;
}) {
  return (
    <Paper
      component="article"
      aria-label={item.title}
      variant="outlined"
      sx={{ borderRadius: "12px", minWidth: 0, overflow: "hidden" }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          {onExpand && (
            <IconButton
              aria-label={`${expanded ? "Collapse" : "Expand"} ${item.title}`}
              aria-expanded={expanded === undefined ? undefined : expanded}
              onClick={onExpand}
              sx={{ ml: -1 }}
            >
              {expanded ? <ExpandMore /> : <ChevronRight />}
            </IconButton>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
                minHeight: 44,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 0.75,
                  alignItems: "center",
                  color: "primary.main",
                }}
              >
                {kind === "epic" ? (
                  <AccountTreeOutlined fontSize="small" />
                ) : (
                  <LayersOutlined fontSize="small" />
                )}
                <Typography variant="overline">{kind}</Typography>
              </Box>
              <Chip
                size="small"
                label={formatStatusName(item.status?.name ?? "Unclassified")}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <Tooltip title="Edit">
              <IconButton aria-label={`Edit ${item.title}`} onClick={onEdit}>
                <EditOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                aria-label={`Delete ${item.title}`}
                onClick={onDelete}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography
          component={kind === "epic" ? "h2" : "h3"}
          sx={{
            mt: 1,
            fontSize: kind === "epic" ? 20 : 18,
            fontWeight: 600,
            overflowWrap: "anywhere",
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {count}
        </Typography>
        {item.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1.5, overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
          >
            {item.description}
          </Typography>
        )}
        {item.acceptanceCriteria && (
          <Box component="details" sx={{ mt: 1.5, overflowWrap: "anywhere" }}>
            <Typography
              component="summary"
              sx={{ cursor: "pointer", color: "text.secondary", fontSize: 14 }}
            >
              Acceptance criteria
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {item.acceptanceCriteria}
            </Typography>
          </Box>
        )}
      </Box>
      {children && (
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: expanded === false ? 0 : 3 }}>
          {children}
        </Box>
      )}
    </Paper>
  );
}
