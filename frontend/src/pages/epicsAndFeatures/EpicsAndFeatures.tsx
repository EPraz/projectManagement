import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { useHierarchy } from "./useHierarchy";
import { HierarchyEditor } from "./HierarchyEditor";
import { HierarchyDeleteDialog } from "./HierarchyDeleteDialog";
import HierarchyTree from "./HierarchyTree";
import HierarchyLevels from "./HierarchyLevels";
import type { HierarchyItem } from "./HierarchyCard";
import type { HierarchyKind, HierarchyTarget } from "./types";
export default function EpicsAndFeaturesPage() {
  const [query, setQuery] = useState("");
  const [params, setParams] = useSearchParams();
  const [expanded, setExpanded] = useState(
    new Set<string>(params.get("epicId") ? [params.get("epicId")!] : []),
  );
  const { project, epics, save, remove } = useHierarchy(query);
  const [editing, setEditing] = useState<HierarchyTarget | null>(null);
  const [deleting, setDeleting] = useState<HierarchyTarget | null>(null);
  const projectScope = useRef(project?.id);
  const wide = useMediaQuery(useTheme().breakpoints.up("md"));
  useEffect(() => {
    if (projectScope.current === project?.id) return;
    projectScope.current = project?.id;
    setEditing(null);
    setDeleting(null);
    setExpanded(new Set());
    setQuery("");
  }, [project?.id]);
  const targetFor = (
    kind: HierarchyKind,
    item: HierarchyItem,
  ): HierarchyTarget => ({
    kind,
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    acceptanceCriteria: item.acceptanceCriteria ?? "",
    statusId: item.status?.id ?? "",
    parentId: kind === "epic" ? (project?.id ?? "") : (item.epicId ?? ""),
  });
  const create = (kind: HierarchyKind) =>
    setEditing({
      kind,
      title: "",
      description: "",
      acceptanceCriteria: "",
      statusId: "",
      parentId:
        kind === "epic"
          ? (project?.id ?? "")
          : (params.get("epicId") ?? project?.epics[0]?.id ?? ""),
    });
  const select = (epicId?: string, featureId?: string) => {
    const next = new URLSearchParams(params);
    if (epicId) {
      next.set("epicId", epicId);
      setExpanded((current) => new Set([...current, epicId]));
    } else next.delete("epicId");
    if (featureId) next.set("featureId", featureId);
    else next.delete("featureId");
    setParams(next);
  };
  const views = {
    epics,
    sprints: project?.sprints ?? [],
    edit: (kind: HierarchyKind, item: HierarchyItem) =>
      setEditing(targetFor(kind, item)),
    remove: (kind: HierarchyKind, item: HierarchyItem) =>
      setDeleting(targetFor(kind, item)),
    openTicket: (id: number) => {
      const next = new URLSearchParams(params);
      next.set("ticketId", String(id));
      setParams(next);
    },
  };
  const deletingFeatures =
    deleting?.kind === "epic"
      ? (project?.epics
          .find((epic) => epic.id === deleting.id)
          ?.features.map((feature) => feature.id) ?? [])
      : deleting?.id
        ? [deleting.id]
        : [];
  const deletingTickets =
    project?.tickets.filter(
      (ticket) =>
        ticket.featureId && deletingFeatures.includes(ticket.featureId),
    ) ?? [];
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <Box sx={{ flex: "1 1 280px" }}>
          <Typography variant="overline" color="primary">
            Structure / Project-wide
          </Typography>
          <Typography component="h1" variant="h1">
            Epics &amp; Features
            <Box component="span" sx={{ color: "primary.main" }}>
              .
            </Box>
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => create("epic")}
        >
          New Epic
        </Button>
        <Button
          variant="outlined"
          disabled={!project?.epics.length}
          onClick={() => create("feature")}
        >
          New Feature
        </Button>
      </Box>
      <TextField
        label="Search epics and features"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (params.has("epicId") || params.has("featureId")) {
            const next = new URLSearchParams(params);
            next.delete("epicId");
            next.delete("featureId");
            setParams(next, { replace: true });
          }
        }}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
        }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ my: 3 }}>
        {project?.epics.length ?? 0} epics ·{" "}
        {project?.epics.reduce((sum, epic) => sum + epic.features.length, 0) ??
          0}{" "}
        features ·{" "}
        {project?.tickets.filter((ticket) => Boolean(ticket.featureId))
          .length ?? 0}{" "}
        linked tickets · All sprints and unplanned work
      </Typography>
      {!epics.length ? (
        <Alert severity="info">
          {query ? "No matching epics or features." : "No epics yet."}
        </Alert>
      ) : wide ? (
        <HierarchyTree
          {...views}
          expanded={expanded}
          toggle={(id) =>
            setExpanded((current) => {
              const next = new Set(current);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })
          }
        />
      ) : (
        <HierarchyLevels
          {...views}
          epicId={params.get("epicId")}
          featureId={params.get("featureId")}
          select={select}
        />
      )}
      {editing && (
        <HierarchyEditor
          key={`${project?.id}:${editing.kind}:${editing.id ?? "new"}`}
          target={editing}
          parents={project?.epics ?? []}
          statuses={
            (editing.kind === "epic"
              ? project?.epicStatuses
              : project?.featureStatuses) ?? []
          }
          save={save}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <HierarchyDeleteDialog
          key={`${project?.id}:${deleting.kind}:${deleting.id}`}
          target={deleting}
          ticketCount={deletingTickets.length}
          taskCount={deletingTickets.reduce(
            (sum, ticket) => sum + ticket.tasks.length,
            0,
          )}
          remove={remove}
          onClose={() => setDeleting(null)}
        />
      )}
    </Box>
  );
}
