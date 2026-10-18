import { Box, Collapse, Typography } from "@mui/material";
import type { Sprint } from "../../types";
import HierarchyCard, { type HierarchyItem } from "./HierarchyCard";
import LinkedTickets from "./LinkedTickets";
import type { HierarchyKind } from "./types";
import type { useHierarchy } from "./useHierarchy";
export type HierarchyViewProps = {
  epics: ReturnType<typeof useHierarchy>["epics"];
  sprints: Sprint[];
  edit: (kind: HierarchyKind, item: HierarchyItem) => void;
  remove: (kind: HierarchyKind, item: HierarchyItem) => void;
  openTicket: (id: number) => void;
};
export default function HierarchyTree({
  epics,
  sprints,
  edit,
  remove,
  openTicket,
  expanded,
  toggle,
}: HierarchyViewProps & {
  expanded: Set<string>;
  toggle: (id: string) => void;
}) {
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      {epics.map((epic) => (
        <HierarchyCard
          key={epic.id}
          item={epic}
          kind="epic"
          expanded={expanded.has(epic.id)}
          onExpand={() => toggle(epic.id)}
          onEdit={() => edit("epic", epic)}
          onDelete={() => remove("epic", epic)}
          count={`${epic.features.length} features · ${epic.features.reduce((sum, feature) => sum + feature.tickets.length, 0)} linked tickets`}
        >
          <Collapse in={expanded.has(epic.id)} unmountOnExit>
            {!epic.features.length && (
              <Typography color="text.secondary">No features yet.</Typography>
            )}
            <Box
              sx={{
                display: "grid",
                gap: 2,
                pl: { xs: 0, md: 3 },
                borderLeft: { md: "2px solid" },
                borderColor: { md: "divider" },
              }}
            >
              {epic.features.map((feature) => (
                <HierarchyCard
                  key={feature.id}
                  item={feature}
                  kind="feature"
                  onEdit={() => edit("feature", feature)}
                  onDelete={() => remove("feature", feature)}
                  count={`${feature.tickets.length} linked tickets`}
                >
                  <LinkedTickets
                    tickets={feature.tickets}
                    sprints={sprints}
                    open={openTicket}
                  />
                </HierarchyCard>
              ))}
            </Box>
          </Collapse>
        </HierarchyCard>
      ))}
    </Box>
  );
}
