import { Alert, Box, Button, Tab, Tabs } from "@mui/material";
import { DeleteOutline, SaveOutlined } from "@mui/icons-material";
import type { TicketEditDialogProps } from "../../types";
import EditorShell from "../workItemEditor/EditorShell";
import EditorNavigationGuard from "../workItemEditor/EditorNavigationGuard";
import UnsavedChangesDialog from "../workItemEditor/UnsavedChangesDialog";
import DeleteConfirmationModal from "../deleteConfirmationModal/DeleteConfirmationModal";
import TicketDetailsFields from "./TicketDetailsFields";
import TicketPlanningFields from "./TicketPlanningFields";
import TicketAdditionalFields from "./TicketAdditionalFields";
import TicketTasks from "./TicketTasks";
import TicketSummary from "./TicketSummary";
import { useTicketEditor } from "./useTicketEditor";
export default function TicketEditDialog(props: TicketEditDialogProps) {
  const editor = useTicketEditor(props);
  const { draft, readOnly, tab, exit } = editor;
  if (!draft) return null;
  const fields = {
    draft,
    errors: editor.errors,
    disabled: readOnly,
    change: editor.change,
  };
  const tabs = ["Details", "Planning", "Tasks", "Additional Info"];
  return (
    <>
      <EditorNavigationGuard {...exit.guardProps} />
      <EditorShell
        open={props.open}
        title={editor.creating ? "Create Ticket" : "Ticket Details"}
        context={
          props.ticket
            ? `TICKET / #${props.ticket.id} · ${props.projectName ?? props.ticket.project?.title ?? "Project work item"}`
            : `NEW TICKET / ${props.projectName ?? "Shared demo workspace"}`
        }
        closeLabel="Close ticket editor"
        pending={readOnly}
        onClose={exit.requestClose}
        actions={
          <>
            {!editor.creating && props.onDelete && (
              <Button
                color="error"
                startIcon={<DeleteOutline />}
                onClick={() => editor.setConfirmDelete(true)}
                disabled={readOnly}
              >
                Delete
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              onClick={exit.requestClose}
              disabled={readOnly}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveOutlined />}
              onClick={() => {
                void editor.save();
              }}
              disabled={readOnly}
            >
              {editor.action === "save" ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        {editor.failure && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {editor.failure}
          </Alert>
        )}
        <Tabs
          value={tab}
          onChange={(_, value) => editor.setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Ticket sections"
          sx={{ mb: 3 }}
        >
          {tabs.map((label, index) => (
            <Tab
              key={label}
              label={label}
              id={`ticket-tab-${index}`}
              aria-controls={`ticket-panel-${index}`}
              sx={{ px: 2, minWidth: "auto" }}
            />
          ))}
        </Tabs>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0,1fr)",
              md: "minmax(0,1fr) 240px",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box
            role="tabpanel"
            id={`ticket-panel-${tab}`}
            aria-labelledby={`ticket-tab-${tab}`}
            sx={{ minWidth: 0 }}
          >
            {tab === 0 && (
              <TicketDetailsFields
                {...fields}
                statuses={props.statuses}
                users={props.users}
                tickets={props.tickets}
                creating={editor.creating}
              />
            )}
            {tab === 1 && (
              <TicketPlanningFields
                {...fields}
                sprints={props.sprints ?? []}
                features={props.features}
              />
            )}
            {tab === 2 && (
              <TicketTasks
                ticket={props.ticket}
                disabled={readOnly}
                onCreate={
                  props.onCreateTask
                    ? () => exit.requestAction(props.onCreateTask!)
                    : undefined
                }
                onOpen={
                  props.onOpenTask
                    ? (task) =>
                        exit.requestAction(() => props.onOpenTask!(task))
                    : undefined
                }
              />
            )}
            {tab === 3 && (
              <TicketAdditionalFields {...fields} ticket={props.ticket} />
            )}
          </Box>
          <TicketSummary
            draft={draft}
            ticket={props.ticket}
            statuses={props.statuses}
            users={props.users}
          />
        </Box>
      </EditorShell>
      <UnsavedChangesDialog {...exit.warningProps} />
      {editor.confirmDelete && (
        <DeleteConfirmationModal
          open
          onClose={() => editor.setConfirmDelete(false)}
          onConfirm={editor.remove}
          itemName={draft.title || "this ticket"}
          itemKey={`ticket:${draft.id}`}
          disabled={readOnly}
        />
      )}
    </>
  );
}
