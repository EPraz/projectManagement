import { useEffect, useRef } from "react";
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import HierarchyCard from "./HierarchyCard";
import LinkedTickets from "./LinkedTickets";
import type { HierarchyViewProps } from "./HierarchyTree";
export default function HierarchyLevels({
  epics,
  sprints,
  edit,
  remove,
  openTicket,
  epicId,
  featureId,
  select,
}: HierarchyViewProps & {
  epicId: string | null;
  featureId: string | null;
  select: (epicId?: string, featureId?: string) => void;
}) {
  const focus = useRef<HTMLDivElement>(null);
  const level = `${epicId ?? ""}:${featureId ?? ""}`;
  const previousLevel = useRef(level);
  useEffect(() => {
    if (previousLevel.current === level) return;
    previousLevel.current = level;
    focus.current?.focus();
  }, [level]);
  const epic = epics.find((item) => item.id === epicId);
  const feature = epic?.features.find((item) => item.id === featureId);
  return (
    <Box
      ref={focus}
      tabIndex={-1}
      role="region"
      aria-label="Hierarchy levels"
      sx={{ display: "grid", gap: 2 }}
    >
      {epicId && (
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: "12px", minWidth: 0 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => (feature ? select(epic?.id) : select())}
          >
            {feature ? "Back to features" : "All epics"}
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, overflowWrap: "anywhere" }}
          >
            Project / {epic?.title ?? "Unavailable epic"}
            {feature ? ` / ${feature.title}` : ""}
          </Typography>
        </Paper>
      )}
      {epicId && !epic && (
        <Alert severity="info">
          This epic is no longer available. Choose another epic.
        </Alert>
      )}
      {epic && featureId && !feature && (
        <Alert severity="info">
          This feature has moved or is no longer available. Choose a feature
          below.
        </Alert>
      )}
      {!epic ? (
        epics.map((item) => (
          <HierarchyCard
            key={item.id}
            item={item}
            kind="epic"
            count={`${item.features.length} features`}
            onExpand={() => select(item.id)}
            onEdit={() => edit("epic", item)}
            onDelete={() => remove("epic", item)}
          />
        ))
      ) : !feature ? (
        <>
          <Typography
            component="h2"
            sx={{ fontSize: 23, fontWeight: 600, overflowWrap: "anywhere" }}
          >
            {epic.title}
          </Typography>
          {!epic.features.length && (
            <Typography color="text.secondary">No features yet.</Typography>
          )}
          {epic.features.map((item) => (
            <HierarchyCard
              key={item.id}
              item={item}
              kind="feature"
              count={`${item.tickets.length} linked tickets`}
              onExpand={() => select(epic.id, item.id)}
              onEdit={() => edit("feature", item)}
              onDelete={() => remove("feature", item)}
            />
          ))}
        </>
      ) : (
        <HierarchyCard
          item={feature}
          kind="feature"
          count={`${feature.tickets.length} linked tickets`}
          onEdit={() => edit("feature", feature)}
          onDelete={() => remove("feature", feature)}
        >
          <LinkedTickets
            tickets={feature.tickets}
            sprints={sprints}
            open={openTicket}
          />
        </HierarchyCard>
      )}
    </Box>
  );
}
