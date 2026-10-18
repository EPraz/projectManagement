import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { useHierarchy } from "./useHierarchy";
import { HierarchyEditor } from "./HierarchyEditor";
import type { HierarchyTarget } from "./types";
import { HierarchyDeleteDialog } from "./HierarchyDeleteDialog";
import {
  Container,
  Content,
  EpicCard,
  FeatureCard,
  Header,
  ItemContent,
  ItemHeader,
  SearchBar
} from "./EpicsAndFeatures.styles";

export default function EpicsAndFeaturesPage() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(new Set<string>());
  const { project, epics, save, remove } = useHierarchy(query);
  const [editing, setEditing] = useState<HierarchyTarget | null>(null);
  const [deleting, setDeleting] = useState<HierarchyTarget | null>(null);
  const targetFor = (
    kind: HierarchyTarget["kind"],
    item: {
      id: string;
      title: string;
      description?: string;
      acceptanceCriteria?: string;
      status?: { id: string };
      epicId?: string;
    }
  ): HierarchyTarget => ({
    kind,
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    acceptanceCriteria: item.acceptanceCriteria ?? "",
    statusId: item.status?.id ?? "",
    parentId: kind === "epic" ? (project?.id ?? "") : (item.epicId ?? "")
  });
  const deletingFeatures =
    deleting?.kind === "epic"
      ? (project?.epics
          .find((item) => item.id === deleting.id)
          ?.features.map((item) => item.id) ?? [])
      : deleting?.id
        ? [deleting.id]
        : [];
  const deletingTickets =
    project?.tickets.filter(
      (ticket) =>
        ticket.featureId && deletingFeatures.includes(ticket.featureId)
    ) ?? [];
  const create = (kind: HierarchyTarget["kind"]) =>
    setEditing({
      kind,
      title: "",
      description: "",
      acceptanceCriteria: "",
      statusId: "",
      parentId:
        kind === "epic" ? (project?.id ?? "") : (project?.epics[0]?.id ?? "")
    });
  const navigate = useNavigate();
  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <Container>
      <Header elevation={0} sx={{ gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" component="h1">
          Epics &amp; Features
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="contained" onClick={() => create("epic")}>
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
        <SearchBar>
          <TextField
            size="small"
            label="Search epics and features"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </SearchBar>
      </Header>
      <Content>
        {!epics.length && (
          <Typography>
            {query ? "No matching epics or features." : "No epics yet."}
          </Typography>
        )}
        {epics.map((epic) => (
          <EpicCard
            key={epic.id}
            role="article"
            aria-label={epic.title}
            elevation={0}
          >
            <ItemHeader>
              <IconButton
                aria-label={`${expanded.has(epic.id) ? "Collapse" : "Expand"} ${epic.title}`}
                aria-expanded={expanded.has(epic.id)}
                onClick={() => toggle(epic.id)}
              >
                {expanded.has(epic.id) ? (
                  <ExpandMoreIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
              <ItemContent>
                <Typography variant="subtitle1" component="h2">
                  {epic.title}
                </Typography>
                <Chip size="small" label={epic.status?.name ?? "Unspecified"} />
              </ItemContent>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Button
                  aria-label={`Edit ${epic.title}`}
                  onClick={() => setEditing(targetFor("epic", epic))}
                >
                  Edit
                </Button>
                <Button
                  color="error"
                  aria-label={`Delete ${epic.title}`}
                  onClick={() => setDeleting(targetFor("epic", epic))}
                >
                  Delete
                </Button>
              </Box>
            </ItemHeader>
            <Collapse in={expanded.has(epic.id)} unmountOnExit>
              {!epic.features.length && (
                <Typography sx={{ px: 3, pb: 2 }}>No features yet.</Typography>
              )}
              {epic.features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  elevation={0}
                  sx={{ mr: 2, ml: { xs: 2, sm: 7 } }}
                >
                  <ItemHeader>
                    <ItemContent>
                      <Typography component="h3" variant="body1">
                        {feature.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={feature.status?.name ?? "Unspecified"}
                      />
                    </ItemContent>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <Button
                        aria-label={`Edit ${feature.title}`}
                        onClick={() =>
                          setEditing(targetFor("feature", feature))
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        aria-label={`Delete ${feature.title}`}
                        onClick={() =>
                          setDeleting(targetFor("feature", feature))
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  </ItemHeader>
                  <Box
                    sx={{
                      px: 2,
                      pb: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 1
                    }}
                  >
                    {!feature.tickets.length && (
                      <Typography variant="body2" color="text.secondary">
                        No linked tickets.
                      </Typography>
                    )}
                    {feature.tickets.map((ticket) => (
                      <Button
                        key={ticket.id}
                        sx={{ textAlign: "left", justifyContent: "flex-start" }}
                        onClick={() =>
                          navigate(
                            `/projects/${project?.id}/board?tab=backlog&ticketId=${ticket.id}`
                          )
                        }
                      >
                        {ticket.title}
                      </Button>
                    ))}
                  </Box>
                </FeatureCard>
              ))}
            </Collapse>
          </EpicCard>
        ))}
      </Content>
      {editing && (
        <HierarchyEditor
          key={`${editing.kind}:${editing.id ?? "new"}`}
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
          key={`${deleting.kind}:${deleting.id}`}
          target={deleting}
          ticketCount={deletingTickets.length}
          taskCount={deletingTickets.reduce(
            (total, ticket) => total + ticket.tasks.length,
            0
          )}
          remove={remove}
          onClose={() => setDeleting(null)}
        />
      )}
    </Container>
  );
}
