import React, { useState, useEffect, useCallback } from "react";
import {
  DialogContent,
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
  SelectChangeEvent,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Task, TaskEditDialogProps } from "../../types";
import { omitProps } from "../../helpers";
import { useAuth } from "../../context";
import {
  Header,
  LeftPanel,
  MainContent,
  RightPanel,
  Section,
  SectionTitle,
  StyledDialog,
  TimeTrackingGrid,
} from "./TaskEditDialog.styles";

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  onClose,
  task,
  onSave,
  onDelete,
  users,
  disabled = false,
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    } else {
      setEditedTask(null);
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!editedTask) return;

    const numericFields = [
      "estimatedHours",
      "remainingHours",
      "completedHours",
    ];
    const newValue = numericFields.includes(name)
      ? value === ""
        ? undefined
        : Number(value)
      : value;

    setEditedTask((prev) => (prev ? { ...prev, [name]: newValue } : null));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = useCallback(() => {
    if (!editedTask) return;
    const dataToSend = omitProps(editedTask, [
      "createdAt",
      "createdBy",
      "status",
      "ticketId",
      "updatedAt",
      "acceptanceCriteria",
    ]);
    onSave({ ...dataToSend, updatedBy: currentUser?.email });
    onClose();
  }, [editedTask, currentUser, onSave]);

  if (!editedTask) return null;
  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Header>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {task?.id ? "Task Details" : "New Task"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Header>

      <DialogContent sx={{ p: 0 }}>
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
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
              />
            </Section>
          </LeftPanel>

          <RightPanel>
            <Section>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  name="assignedTo"
                  value={editedTask.assignedTo || ""}
                  onChange={handleChange}
                  label="Assigned To"
                  disabled={disabled}
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
                <TextField
                  name="estimatedHours"
                  label="Estimated Hours"
                  type="number"
                  value={editedTask.estimatedHours?.toString() ?? ""}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    inputProps: { min: 0, step: 0.5 },
                  }}
                  disabled={disabled}
                />
                <TextField
                  name="remainingHours"
                  label="Remaining Hours"
                  type="number"
                  value={editedTask.remainingHours?.toString() ?? ""}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    inputProps: { min: 0, step: 0.5 },
                  }}
                />
                <TextField
                  name="completedHours"
                  label="Completed Hours"
                  type="number"
                  value={editedTask.completedHours?.toString() ?? ""}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    inputProps: { min: 0, step: 0.5 },
                  }}
                  disabled={disabled}
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
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={disabled}
              >
                Save
              </Button>
              {onDelete && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    onDelete(editedTask);
                    onClose();
                  }}
                  disabled={disabled}
                >
                  Delete
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
