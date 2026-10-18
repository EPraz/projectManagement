import {
  Alert,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, DeleteOutline, SaveOutlined } from "@mui/icons-material";
import type { TaskEditDialogProps } from "../../types";
import { formatStatusName } from "../../helpers";
import EditorShell from "../workItemEditor/EditorShell";
import EditorSelect from "../workItemEditor/EditorSelect";
import EditorNavigationGuard from "../workItemEditor/EditorNavigationGuard";
import UnsavedChangesDialog from "../workItemEditor/UnsavedChangesDialog";
import DeleteConfirmationModal from "../deleteConfirmationModal/DeleteConfirmationModal";
import { EstimateFields } from "../workItemEditor/EstimateFields";
import { useTaskEditor } from "./useTaskEditor";
export default function TaskEditDialog(props: TaskEditDialogProps) {
  const editor = useTaskEditor(props);
  const { draft, readOnly, exit, creating } = editor;
  if (!draft) return null;
  const statuses = [
    ...(props.statuses ?? (props.task?.status ? [props.task.status] : [])),
  ].sort((a, b) => a.position - b.position);
  return (
    <>
      <EditorNavigationGuard {...exit.guardProps} />
      <EditorShell
        open={props.open}
        title={creating ? "Create Task" : "Task Details"}
        context={`${creating ? "NEW TASK" : `TASK / #${draft.id}`} · ${props.projectName ?? "Project work item"}`}
        closeLabel="Close task editor"
        pending={readOnly}
        onClose={exit.requestClose}
        actions={
          <>
            {!creating && props.onDelete && (
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
        {props.parentTicket && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: "8px",
              overflowWrap: "anywhere",
            }}
          >
            {props.onBackToTicket ? (
              <Button
                startIcon={<ArrowBack />}
                aria-label={`Back to ticket #${props.parentTicket.id}`}
                onClick={() => exit.requestAction(props.onBackToTicket!)}
                disabled={readOnly}
              >
                Ticket #{props.parentTicket.id}
              </Button>
            ) : (
              <Typography variant="overline">
                Ticket #{props.parentTicket.id}
              </Typography>
            )}
            <Typography sx={{ fontWeight: 600 }}>
              {props.parentTicket.title}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0,1fr)",
              md: creating ? "minmax(0,1fr)" : "minmax(0,1fr) 280px",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "grid", gap: 3, minWidth: 0 }}>
            <TextField
              label="Title"
              placeholder="Task title"
              required
              fullWidth
              value={draft.title ?? ""}
              onChange={(e) => editor.change({ title: e.target.value })}
              disabled={readOnly}
              error={Boolean(editor.errors.title)}
              helperText={editor.errors.title}
            />
            <TextField
              label="Description"
              placeholder="Add a more detailed description..."
              multiline
              minRows={4}
              fullWidth
              value={draft.description ?? ""}
              onChange={(e) => editor.change({ description: e.target.value })}
              disabled={readOnly}
            />
            {!creating && (
              <TextField
                label="Discussion"
                placeholder="Add notes or discussion points..."
                multiline
                minRows={4}
                fullWidth
                value={draft.discussion ?? ""}
                onChange={(e) => editor.change({ discussion: e.target.value })}
                disabled={readOnly}
              />
            )}
            {creating && (
              <Alert severity="info">
                Tasks start in To do. After creation, you can assign a teammate,
                change status and track hours.
              </Alert>
            )}
          </Box>
          {!creating && (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                p: 2,
                bgcolor: "action.hover",
                borderRadius: "8px",
                minWidth: 0,
              }}
            >
              <Typography component="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
                Execution
              </Typography>
              <EditorSelect
                label="Change status"
                value={draft.statusId ?? ""}
                onChange={(statusId) => editor.change({ statusId })}
                disabled={readOnly}
                error={editor.errors.statusId}
              >
                {!statuses.some((s) => s.id === draft.statusId) && (
                  <MenuItem value={draft.statusId ?? ""} disabled>
                    Unavailable status
                  </MenuItem>
                )}
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {formatStatusName(status.name)}
                  </MenuItem>
                ))}
              </EditorSelect>
              <EditorSelect
                label="Assigned To"
                value={draft.assignedTo ?? ""}
                onChange={(assignedTo) => editor.change({ assignedTo })}
                disabled={readOnly}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {draft.assignedTo &&
                  !(props.users ?? []).some(
                    (user) => user.id === draft.assignedTo,
                  ) && (
                    <MenuItem value={draft.assignedTo} disabled>
                      {draft.assignedUser?.name ?? "Assigned person"} · Outside
                      project team
                    </MenuItem>
                  )}
                {props.users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </EditorSelect>
              <Typography component="h3" sx={{ fontSize: 18, fontWeight: 600 }}>
                Time tracking
              </Typography>
              <EstimateFields
                values={draft}
                errors={editor.errors}
                disabled={readOnly}
                onChange={(field, value) => editor.change({ [field]: value })}
              />
              <Typography variant="body2" color="text.secondary">
                Task state and tracked hours are independent of the ticket’s
                state.
              </Typography>
            </Box>
          )}
        </Box>
      </EditorShell>
      <UnsavedChangesDialog {...exit.warningProps} />
      {editor.confirmDelete && (
        <DeleteConfirmationModal
          open
          onClose={() => editor.setConfirmDelete(false)}
          onConfirm={editor.remove}
          itemName={draft.title || "this task"}
          itemKey={`task:${draft.id}`}
          disabled={readOnly}
        />
      )}
    </>
  );
}
