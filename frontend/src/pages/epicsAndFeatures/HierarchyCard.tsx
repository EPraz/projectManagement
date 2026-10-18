import type { ReactNode } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import {
  ChevronRight,
  ExpandMore,
  LayersOutlined,
  AccountTreeOutlined,
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
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "start" }}>
          {onExpand && (
            <IconButton
              aria-label={`${expanded ? "Collapse" : "Expand"} ${item.title}`}
              aria-expanded={Boolean(expanded)}
              onClick={onExpand}
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
                mb: 1,
                color: "primary.main",
              }}
            >
              {kind === "epic" ? (
                <AccountTreeOutlined fontSize="small" />
              ) : (
                <LayersOutlined fontSize="small" />
              )}
              <Typography variant="overline">{kind}</Typography>
              <Chip
                size="small"
                label={formatStatusName(item.status?.name ?? "Unclassified")}
              />
            </Box>
            <Typography
              component={kind === "epic" ? "h2" : "h3"}
              sx={{
                fontSize: kind === "epic" ? 20 : 18,
                fontWeight: 600,
                overflowWrap: "anywhere",
              }}
            >
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {count}
            </Typography>
          </Box>
        </Box>
        {item.description && (
          <Typography
            sx={{ mt: 2, overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
          >
            {item.description}
          </Typography>
        )}
        {item.acceptanceCriteria && (
          <Box component="details" sx={{ mt: 2, overflowWrap: "anywhere" }}>
            <Typography
              component="summary"
              sx={{ cursor: "pointer", color: "text.secondary", fontSize: 14 }}
            >
              Acceptance criteria
            </Typography>
            <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {item.acceptanceCriteria}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            mt: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button aria-label={`Edit ${item.title}`} onClick={onEdit}>
            Edit
          </Button>
          <Button
            color="error"
            aria-label={`Delete ${item.title}`}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
      {children && <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>{children}</Box>}
    </Paper>
  );
}
