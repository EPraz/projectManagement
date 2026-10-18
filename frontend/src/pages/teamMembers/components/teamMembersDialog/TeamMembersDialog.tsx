import { useLayoutEffect, useRef } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { TeamMembersDialogProps } from "../../../../types";
import EditorShell from "../../../../components/workItemEditor/EditorShell";
import EditorNavigationGuard from "../../../../components/workItemEditor/EditorNavigationGuard";
import UnsavedChangesDialog from "../../../../components/workItemEditor/UnsavedChangesDialog";
import { useEditorExit } from "../../../../components/workItemEditor/useEditorExit";
export default function TeamMembersDialog(props: TeamMembersDialogProps) {
  const generation = useRef(0);
  useLayoutEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  const selectedSnapshot = useRef<
    TeamMembersDialogProps["availableUsers"][number] | null
  >(null);
  const availableSelection = props.availableUsers.find(
    (user) => user.id === props.selectedUser,
  );
  if (availableSelection) selectedSnapshot.current = availableSelection;
  else if (!props.selectedUser) selectedSnapshot.current = null;
  // A confirmed socket event can remove the just-added person from available
  // options before the HTTP save finishes. Keep that pending choice visible.
  const selection =
    availableSelection ??
    (props.loadingCreateProjectUser &&
    selectedSnapshot.current?.id === props.selectedUser
      ? selectedSnapshot.current
      : null);
  const options =
    selection && !props.availableUsers.some((user) => user.id === selection.id)
      ? [selection, ...props.availableUsers]
      : props.availableUsers;
  const valid = props.availableUsers.some(
    (user) => user.id === props.selectedUser,
  );
  const close = () => {
    props.setSelectedUser(null);
    props.setOpenDialog(false);
  };
  const save = async () => {
    if (!valid || props.loadingCreateProjectUser) return;
    const started = generation.current;
    if ((await props.handleAddMember()) && started === generation.current)
      exit.finish();
  };
  const exit = useEditorExit({
    identity: `${props.openDialog}:membership`,
    dirty: Boolean(props.selectedUser),
    pending: props.loadingCreateProjectUser,
    onClose: close,
    onSave: () => {
      void save();
    },
    failure: props.mutationError ?? "",
  });
  return (
    <>
      <EditorNavigationGuard {...exit.guardProps} />
      <EditorShell
        open={props.openDialog}
        title="Add Team Member"
        context={props.projectName}
        panelWidth={760}
        closeLabel="Close member selector"
        pending={props.loadingCreateProjectUser}
        onClose={exit.requestClose}
        actions={
          <>
            <Button
              disabled={props.loadingCreateProjectUser}
              onClick={exit.requestClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              aria-busy={props.loadingCreateProjectUser}
              startIcon={
                props.loadingCreateProjectUser ? (
                  <CircularProgress size={18} />
                ) : undefined
              }
              onClick={() => {
                void save();
              }}
              disabled={
                Boolean(props.catalogError) ||
                props.loadingCreateProjectUser ||
                !valid ||
                props.loadingUsers
              }
            >
              Add Member
            </Button>
          </>
        }
      >
        <Box sx={{ display: "grid", gap: 3, pt: 1 }}>
          <Typography color="text.secondary">
            Choose someone from the existing demo catalog to join this project.
          </Typography>
          {props.mutationError && (
            <Alert severity="error">{props.mutationError}</Alert>
          )}
          {props.catalogError ? (
            <Alert
              severity="error"
              action={
                <Button
                  disabled={props.loadingUsers}
                  onClick={() => {
                    void props.onRetryUsers();
                  }}
                >
                  Retry users
                </Button>
              }
            >
              {props.catalogError}
            </Alert>
          ) : props.loadingUsers ? (
            <Box
              role="status"
              aria-label="Loading people"
              sx={{ display: "flex", gap: 2, alignItems: "center", py: 3 }}
            >
              <CircularProgress size={24} />
              Loading people…
            </Box>
          ) : !options.length ? (
            <Paper
              sx={{ p: 3, bgcolor: "background.default", borderRadius: "8px" }}
            >
              <Typography>No available users to add</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                All users are already part of this project
              </Typography>
            </Paper>
          ) : (
            <>
              {props.selectedUser &&
                !valid &&
                !props.loadingCreateProjectUser && (
                  <Alert severity="info">
                    The selected person is no longer available to add. Choose
                    someone else.
                  </Alert>
                )}
              <Autocomplete
                id="user-select"
                disabled={props.loadingCreateProjectUser}
                value={selection}
                options={options}
                getOptionLabel={(option) => `${option.email} (${option.name})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, value) =>
                  props.setSelectedUser(value?.id ?? null)
                }
                renderOption={(optionProps, option) => (
                  <MenuItem {...optionProps} key={option.id}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ overflowWrap: "anywhere" }}>
                        {option.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {option.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    placeholder="Search by email or name"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </>
          )}
        </Box>
      </EditorShell>
      <UnsavedChangesDialog {...exit.warningProps} />
    </>
  );
}
