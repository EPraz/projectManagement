import { EstimateFields } from "../workItemEditor/EstimateFields";
import React from "react";
import {
  DialogContent,
  Alert,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  SelectChangeEvent
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { TaskEditDialogProps } from "../../types";
import { taskUpdateFromDraft } from "../../services/workItemUpdates";
import { useWorkItemEditor } from "../workItemEditor/useWorkItemEditor";
import { useAuth } from "../../context";
import {
  Header,
  LeftPanel,
  MainContent,
  RightPanel,
  Section,
  SectionTitle,
  StyledDialog,
  TimeTrackingGrid
} from "./TaskEditDialog.styles";

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  onClose,
  task,
  onSave,
  onDelete,
  users,
  disabled = false
}) => {
  const { user: currentUser } = useAuth();
  const {
    draft: editedTask,
    setDraft: setEditedTask,
    errors,
    setErrors,
    failure,
    pending,
    action,
    save,
    remove
  } = useWorkItemEditor(task, open, onClose);
  const readOnly = disabled || pending;
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!editedTask || readOnly) return;
    const numeric = [
      "estimatedHours",
      "remainingHours",
      "completedHours"
    ].includes(name);
    setEditedTask((previous) =>
      previous
        ? {
            ...previous,
            [name]: numeric ? (value === "" ? undefined : Number(value)) : value
          }
        : null
    );
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSave = () => {
    if (!editedTask || !currentUser?.email || readOnly) return;
    void save(() => onSave(taskUpdateFromDraft(editedTask, currentUser.email)));
  };

  if (!editedTask) return null;
  return (
    <StyledDialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || pending) return;
        onClose();
      }}
      fullWidth
      maxWidth="lg"
      aria-labelledby="task-editor-title"
    >
      <Header>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="task-editor-title" variant="h6">
            {task?.id ? "Task Details" : "New Task"}
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={pending}
            aria-label="Close task editor"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Header>

      <DialogContent sx={{ p: 0 }}>
        {failure && <Alert severity="error">{failure}</Alert>}
        <MainContent>
          <LeftPanel>
            <Section>
              <SectionTitle>Task Information</SectionTitle>
              <TextField
                name="title"
                placeholder="Task title"
                value={editedTask.title || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                error={!!errors.title}
                helperText={errors.title}
                required
                disabled={readOnly}
              />
            </Section>

            <Section>
              <SectionTitle>Description</SectionTitle>
              <TextField
                name="description"
                placeholder="Add a more detailed description..."
                value={editedTask.description || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                size="small"
                disabled={readOnly}
              />
            </Section>

            <Section>
              <SectionTitle>Discussion</SectionTitle>
              <TextField
                name="discussion"
                placeholder="Add notes or discussion points..."
                value={editedTask.discussion || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                size="small"
                disabled={readOnly}
              />
            </Section>
          </LeftPanel>

          <RightPanel>
            <Section>
              <FormControl fullWidth size="small">
                <InputLabel shrink id="task-assignee-label">
                  Assigned To
                </InputLabel>
                <Select
                  name="assignedTo"
                  labelId="task-assignee-label"
                  displayEmpty
                  value={editedTask.assignedTo || ""}
                  onChange={handleChange}
                  label="Assigned To"
                  disabled={readOnly}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {users?.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar alt={user.name} sx={{ width: 24, height: 24 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Section>

            <Section>
              <SectionTitle>Time Tracking</SectionTitle>
              <TimeTrackingGrid>
                <EstimateFields
                  values={editedTask}
                  errors={errors}
                  disabled={readOnly}
                  onChange={(field, value) => {
                    setEditedTask((previous) =>
                      previous ? { ...previous, [field]: value } : null
                    );
                    setErrors((previous) => ({ ...previous, [field]: "" }));
                  }}
                />
              </TimeTrackingGrid>
            </Section>

            <Box
              display="flex"
              justifyContent="space-between"
              flexDirection={"column"}
              p={2}
              gap={1.5}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{ mr: 1 }}
                disabled={readOnly}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={readOnly}
              >
                {action === "save" ? "Saving…" : "Save"}
              </Button>
              {onDelete && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    void remove(() => onDelete(editedTask));
                  }}
                  disabled={readOnly}
                >
                  {action === "delete" ? "Deleting…" : "Delete"}
                </Button>
              )}
            </Box>
          </RightPanel>
        </MainContent>
      </DialogContent>
    </StyledDialog>
  );
};

export default TaskEditDialog;
