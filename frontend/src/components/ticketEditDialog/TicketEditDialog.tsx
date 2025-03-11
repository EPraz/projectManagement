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
  Tab,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import type { Ticket, TicketEditDialogProps } from "../../types";
import { TicketPriority, TicketType } from "../../constants";
import { getPriorityColor, getTypeIcon, omitProps } from "../../helpers";
import { useAuth, useSprint } from "../../context";
import {
  Header,
  LeftPanel,
  MainContent,
  PriorityChip,
  RightPanel,
  Section,
  SectionTitle,
  StyledDialog,
  StyledTabs,
  TimeTrackingGrid,
} from "./TicketEditDialog.styles";

const TicketEditDialog: React.FC<TicketEditDialogProps> = ({
  open,
  onClose,
  ticket,
  onSave,
  onDelete,
  statuses,
  users,
  sprints,
  features,
  projects,
  tickets,
  disabled = false,
}) => {
  const { sprint } = useSprint();
  const [editedTicket, setEditedTicket] = useState<Partial<Ticket> | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState(0);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (ticket) {
      setEditedTicket({ ...ticket });
    } else {
      setEditedTicket(null);
    }
    setErrors({});
    setActiveTab(0);
  }, [ticket, open]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!editedTicket || !name) return;

    setEditedTicket({
      ...editedTicket,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleBlockingTicketChange = (e: SelectChangeEvent<string>) => {
    // Si el valor es "", lo convertimos a null en lugar de undefined.
    const selectedTicketId =
      e.target.value === "" ? null : Number(e.target.value);
    setEditedTicket({
      ...editedTicket,
      blockedBy: selectedTicketId,
    });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const { name } = e.target;
    if (!editedTicket || !name || editedTicket?.isBlocked) return;
    const newStatusId = e.target.value as string;
    setEditedTicket({
      ...editedTicket,
      statusId: newStatusId,
    });
  };

  const handleBlockedChange = () => {
    if (disabled) return;
    const newBlocked = !editedTicket?.isBlocked;
    setEditedTicket({
      ...editedTicket,
      isBlocked: newBlocked,
      statusId: newBlocked
        ? statuses?.find((x) => x.name === "BLOCKED")?.id ||
          editedTicket?.statusId
        : "",
      blockedBy: newBlocked ? editedTicket?.blockedBy : null,
    });
  };

  // const handleDateChange = (date: Date | null, fieldName: string) => {
  //   if (!editedTicket) return;

  //   setEditedTicket({
  //     ...editedTicket,
  //     [fieldName]: date ? date.toISOString() : undefined,
  //   });
  // };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => {
    if (!editedTicket) return;

    const value = e.target.value === "" ? undefined : Number(e.target.value);

    setEditedTicket({
      ...editedTicket,
      [fieldName]: value,
    });
  };

  const handleTagsChange = (
    event: React.SyntheticEvent,
    newValue: string[]
  ) => {
    if (!editedTicket) return;

    setEditedTicket({
      ...editedTicket,
      tags: newValue,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedTicket?.title) {
      newErrors.title = "Title is required";
    }

    if (!editedTicket?.statusId) {
      newErrors.statusId = "Status is required";
    }

    if (!editedTicket?.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!editedTicket?.type) {
      newErrors.type = "Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = useCallback(() => {
    if (!editedTicket || !validateForm()) return;

    const dataToSend = omitProps(editedTicket, [
      "createdBy",
      "createdAt",
      "updatedAt",
      "featureId",
      "projectId",
      "project",
      "tasks",
      "status",
      "blockingTicket",
      "blockedTickets",
      "assignedUser",
      "order",
      "_count",
      "sprint",
      "feature",
      "pairProgrammingUsers",
    ]);

    onSave({
      ...dataToSend,
      updatedBy: currentUser?.email,
      sprintId: sprint?.id,
    });
    onClose();
  }, [editedTicket, currentUser, onSave, onClose]);

  const handleDelete = useCallback(() => {
    if (!editedTicket || !onDelete) return;
    onDelete(editedTicket);
    onClose();
  }, [editedTicket, onDelete, onClose]);

  if (!editedTicket) return null;

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Header>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">
              {ticket?.id ? "Ticket Details" : "New Ticket"}
            </Typography>
            {editedTicket.priority && (
              <PriorityChip
                size="small"
                label={editedTicket.priority}
                priorityColor={getPriorityColor(editedTicket.priority)}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Header>

      <DialogContent sx={{ p: 0 }}>
        <MainContent>
          <LeftPanel>
            <StyledTabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Details" />
              <Tab label="Planning" />
              <Tab label="Additional Info" />
            </StyledTabs>

            {activeTab === 0 && (
              <>
                <Section>
                  <SectionTitle>Ticket Information</SectionTitle>
                  <TextField
                    name="title"
                    placeholder="Ticket title"
                    value={editedTicket.title || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={!!errors.title}
                    helperText={errors.title}
                    required
                    disabled={disabled}
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" gap={2} mb={2}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.statusId}
                    >
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="statusId"
                        value={editedTicket.statusId || ""}
                        onChange={handleStatusChange}
                        label="Status"
                        required
                        disabled={disabled || editedTicket.isBlocked}
                      >
                        {statuses &&
                          statuses.map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: status.color || "#ccc",
                                  }}
                                />
                                {status.name}
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.statusId && (
                        <Typography variant="caption" color="error">
                          {errors.statusId}
                        </Typography>
                      )}
                    </FormControl>

                    <FormControl fullWidth size="small" error={!!errors.type}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="type"
                        value={editedTicket.type || ""}
                        onChange={handleChange}
                        label="Type"
                        required
                        disabled={disabled}
                      >
                        {Object.values(TicketType).map((type) => (
                          <MenuItem key={type} value={type}>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getTypeIcon(type)}
                              {type}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.type && (
                        <Typography variant="caption" color="error">
                          {errors.type}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  <TextField
                    name="description"
                    placeholder="Add a more detailed description..."
                    value={editedTicket.description || ""}
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
                  <SectionTitle>Blocking Status</SectionTitle>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      icon={<BlockIcon />}
                      label="Blocked"
                      color={editedTicket.isBlocked ? "error" : "default"}
                      variant={editedTicket.isBlocked ? "filled" : "outlined"}
                      onClick={handleBlockedChange}
                      disabled={disabled}
                    />

                    {editedTicket.isBlocked && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Blocked By Ticket</InputLabel>
                        <Select
                          name="blockedBy"
                          value={editedTicket?.blockedBy?.toString() || ""}
                          onChange={handleBlockingTicketChange}
                          label="Blocked By Ticket"
                          disabled={disabled}
                        >
                          <MenuItem value="" disabled>
                            <em>Select a ticket</em>
                          </MenuItem>
                          {tickets
                            ?.filter((t) => t.id !== editedTicket.id)
                            ?.map((ticket) => (
                              <MenuItem
                                key={ticket.id}
                                value={ticket.id.toString()}
                              >
                                #{ticket.id} - {ticket.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </Section>
              </>
            )}

            {activeTab === 1 && (
              <>
                <Section>
                  <SectionTitle>Planning</SectionTitle>
                  <Box display="flex" gap={2} mb={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Sprint</InputLabel>
                      <Select
                        name="sprintId"
                        value={editedTicket.sprintId || ""}
                        onChange={handleChange}
                        label="Sprint"
                        disabled={disabled}
                      >
                        <MenuItem value="">
                          <em>Backlog</em>
                        </MenuItem>
                        {sprints?.map((sprint) => (
                          <MenuItem key={sprint.id} value={sprint.id}>
                            {sprint.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel>Feature</InputLabel>
                      <Select
                        name="featureId"
                        value={editedTicket.featureId || ""}
                        onChange={handleChange}
                        label="Feature"
                        disabled={disabled}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {features?.map((feature) => (
                          <MenuItem key={feature.id} value={feature.id}>
                            {feature.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box display="flex" gap={2} mb={2}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!errors.priority}
                    >
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={editedTicket.priority || ""}
                        onChange={handleChange}
                        label="Priority"
                        required
                        disabled={disabled}
                      >
                        {Object.values(TicketPriority).map((priority) => (
                          <MenuItem key={priority} value={priority}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: getPriorityColor(priority),
                                }}
                              />
                              {priority}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.priority && (
                        <Typography variant="caption" color="error">
                          {errors.priority}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Section>

                <Section>
                  <SectionTitle>Story Points & Estimation</SectionTitle>
                  <Box display="flex" gap={2} mb={2}>
                    <TextField
                      label="Story Points"
                      type="number"
                      value={editedTicket.storyPoints ?? ""}
                      onChange={(e) => handleNumberChange(e, "storyPoints")}
                      fullWidth
                      size="small"
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      disabled={disabled}
                    />

                    <TextField
                      label="Estimated Hours"
                      type="number"
                      value={editedTicket.estimatedHours ?? ""}
                      onChange={(e) => handleNumberChange(e, "estimatedHours")}
                      fullWidth
                      size="small"
                      InputProps={{
                        inputProps: { min: 0, step: 0.5 },
                      }}
                      disabled={disabled}
                    />
                  </Box>

                  <Box display="flex" gap={2}>
                    <TextField
                      label="Remaining Hours"
                      type="number"
                      value={editedTicket.remainingHours ?? ""}
                      onChange={(e) => handleNumberChange(e, "remainingHours")}
                      fullWidth
                      size="small"
                      InputProps={{
                        inputProps: { min: 0, step: 0.5 },
                      }}
                      disabled={disabled}
                    />

                    <TextField
                      label="Completed Hours"
                      type="number"
                      value={editedTicket.completedHours ?? ""}
                      onChange={(e) => handleNumberChange(e, "completedHours")}
                      fullWidth
                      size="small"
                      InputProps={{
                        inputProps: { min: 0, step: 0.5 },
                      }}
                      disabled={disabled}
                    />
                  </Box>
                </Section>
              </>
            )}

            {activeTab === 2 && (
              <>
                <Section>
                  <SectionTitle>Acceptance Criteria</SectionTitle>
                  <TextField
                    name="acceptanceCriteria"
                    placeholder="Define what makes this ticket complete..."
                    value={editedTicket.acceptanceCriteria || ""}
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
                  <SectionTitle>Design Information</SectionTitle>
                  <TextField
                    name="designInformation"
                    placeholder="Add design details, links to mockups, etc..."
                    value={editedTicket.designInformation || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                  />
                </Section>

                <Section>
                  <SectionTitle>Additional Details</SectionTitle>
                  <TextField
                    name="additionalDetails"
                    placeholder="Any other relevant information..."
                    value={editedTicket.additionalDetails || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                  />
                </Section>

                <Section>
                  <SectionTitle>Notes & Discussion</SectionTitle>
                  <TextField
                    name="notes"
                    placeholder="Add notes..."
                    value={editedTicket.notes || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    name="discussion"
                    placeholder="Add discussion points..."
                    value={editedTicket.discussion || ""}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                    disabled={disabled}
                  />
                </Section>
              </>
            )}
          </LeftPanel>

          <RightPanel>
            <Section>
              <SectionTitle>Assignment</SectionTitle>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  name="assignedTo"
                  value={editedTicket.assignedTo || ""}
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
                  value={editedTicket.estimatedHours?.toString() ?? ""}
                  onChange={(e) => handleNumberChange(e, "estimatedHours")}
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
                  value={editedTicket.remainingHours?.toString() ?? ""}
                  onChange={(e) => handleNumberChange(e, "remainingHours")}
                  fullWidth
                  size="small"
                  InputProps={{
                    inputProps: { min: 0, step: 0.5 },
                  }}
                  disabled={disabled}
                />
                <TextField
                  name="completedHours"
                  label="Completed Hours"
                  type="number"
                  value={editedTicket.completedHours?.toString() ?? ""}
                  onChange={(e) => handleNumberChange(e, "completedHours")}
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
              mt="auto"
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
                  onClick={handleDelete}
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

export default TicketEditDialog;
