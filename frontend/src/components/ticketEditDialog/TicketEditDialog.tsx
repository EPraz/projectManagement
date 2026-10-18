import { EstimateFields } from "../workItemEditor/EstimateFields";
import { ticketUpdateFromDraft } from "../../services/workItemUpdates";
import { useWorkItemEditor } from "../workItemEditor/useWorkItemEditor";
import React, { useState } from "react";
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
  Tab,
  Chip,
  SelectChangeEvent
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Block as BlockIcon
} from "@mui/icons-material";
import type { Ticket, TicketEditDialogProps } from "../../types";
import { TicketPriority, TicketType } from "../../constants";
import { getPriorityColor, getTypeIcon } from "../../helpers";
import { useAuth } from "../../context";
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
  TimeTrackingGrid
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
  // projects,
  tickets,
  disabled = false
}) => {
  const { user: currentUser } = useAuth();
  const {
    draft: editedTicket,
    setDraft: setEditedTicket,
    errors,
    setErrors,
    failure,
    pending,
    action,
    save,
    remove
  } = useWorkItemEditor<Partial<Ticket>>(ticket, open, onClose);
  const [activeTab, setActiveTab] = useState(0);
  const readOnly = disabled || pending;
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!editedTicket || !name) return;

    setEditedTicket({
      ...editedTicket,
      [name]: value
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleBlockingTicketChange = (e: SelectChangeEvent<string>) => {
    // Si el valor es "", lo convertimos a null en lugar de undefined.
    const selectedTicketId =
      e.target.value === "" ? null : Number(e.target.value);
    setEditedTicket({
      ...editedTicket,
      blockedBy: selectedTicketId
    });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const { name } = e.target;
    if (!editedTicket || !name || editedTicket?.isBlocked) return;
    const newStatusId = e.target.value as string;
    setEditedTicket({
      ...editedTicket,
      statusId: newStatusId
    });
  };

  const handleBlockedChange = () => {
    if (readOnly) return;
    const newBlocked = !editedTicket?.isBlocked;
    setEditedTicket({
      ...editedTicket,
      isBlocked: newBlocked,
      statusId: newBlocked
        ? statuses?.find((x) => x.name === "BLOCKED")?.id ||
          editedTicket?.statusId
        : "",
      blockedBy: newBlocked ? editedTicket?.blockedBy : null
    });
  };

  const handleSave = () => {
    if (!editedTicket || !currentUser?.email || readOnly) return;
    void save(() =>
      onSave(ticketUpdateFromDraft(editedTicket, currentUser.email))
    );
  };

  const handleDelete = () => {
    if (!editedTicket || !onDelete || readOnly) return;
    void remove(() => onDelete(editedTicket));
  };
  if (!editedTicket) return null;

  return (
    <StyledDialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || pending) return;
        onClose();
      }}
      fullWidth
      maxWidth="lg"
      aria-labelledby="ticket-editor-title"
    >
      <Header>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography id="ticket-editor-title" variant="h6">
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
          <IconButton
            onClick={onClose}
            disabled={pending}
            aria-label="Close ticket editor"
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
                    disabled={readOnly}
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
                        data-testid="status-select"
                        name="statusId"
                        value={editedTicket.statusId || ""}
                        onChange={handleStatusChange}
                        label="Status"
                        required
                        disabled={readOnly || editedTicket.isBlocked}
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
                                    backgroundColor: status.color || "#ccc"
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
                        disabled={readOnly}
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
                    disabled={readOnly}
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
                      disabled={readOnly}
                    />

                    {editedTicket.isBlocked && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Blocked By Ticket</InputLabel>
                        <Select
                          name="blockedBy"
                          value={editedTicket?.blockedBy?.toString() || ""}
                          onChange={handleBlockingTicketChange}
                          label="Blocked By Ticket"
                          disabled={readOnly}
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
                      <InputLabel shrink id="ticket-sprint-label">
                        Sprint
                      </InputLabel>
                      <Select
                        name="sprintId"
                        labelId="ticket-sprint-label"
                        displayEmpty
                        value={editedTicket.sprintId || ""}
                        onChange={handleChange}
                        label="Sprint"
                        disabled={readOnly}
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
                      <InputLabel shrink id="ticket-feature-label">
                        Feature
                      </InputLabel>
                      <Select
                        name="featureId"
                        labelId="ticket-feature-label"
                        displayEmpty
                        value={editedTicket.featureId || ""}
                        onChange={handleChange}
                        label="Feature"
                        disabled={readOnly}
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
                        disabled={readOnly}
                      >
                        {Object.values(TicketPriority).map((priority) => (
                          <MenuItem key={priority} value={priority}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: getPriorityColor(priority)
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
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    gap={2}
                  >
                    <EstimateFields
                      values={editedTicket}
                      errors={errors}
                      disabled={readOnly}
                      includeStoryPoints
                      onChange={(field, value) => {
                        setEditedTicket((previous) =>
                          previous ? { ...previous, [field]: value } : null
                        );
                        setErrors((previous) => ({ ...previous, [field]: "" }));
                      }}
                    />
                  </Box>{" "}
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
                    disabled={readOnly}
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
                    disabled={readOnly}
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
                    disabled={readOnly}
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
                    disabled={readOnly}
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
                    disabled={readOnly}
                  />
                </Section>
              </>
            )}
          </LeftPanel>

          <RightPanel>
            <Section>
              <SectionTitle>Assignment</SectionTitle>
              <FormControl fullWidth size="small">
                <InputLabel shrink id="ticket-assignee-label">
                  Assigned To
                </InputLabel>
                <Select
                  name="assignedTo"
                  labelId="ticket-assignee-label"
                  displayEmpty
                  value={editedTicket.assignedTo || ""}
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
                  values={editedTicket}
                  errors={errors}
                  disabled={readOnly}
                  onChange={(field, value) => {
                    setEditedTicket((previous) =>
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
              mt="auto"
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
                  onClick={handleDelete}
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

export default TicketEditDialog;
