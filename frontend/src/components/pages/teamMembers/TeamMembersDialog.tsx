import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { TeamMembersDialogProps } from "../../../types";

const TeamMembersDialog = ({
  openDialog,
  setOpenDialog,
  loadingUsers,
  availableUsers,
  setSelectedUser,
  handleAddMember,
  loadingCreateProjectUser,
  selectedUser,
}: TeamMembersDialogProps) => {
  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        Add Team Member
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {loadingUsers ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : availableUsers.length === 0 ? (
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "background.default",
              }}
            >
              <Typography variant="body1" gutterBottom>
                No available users to add
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All users are already part of this project
              </Typography>
            </Paper>
          ) : (
            <Autocomplete
              id="user-select"
              options={availableUsers}
              getOptionLabel={(option) => `${option.email} (${option.name})`}
              renderOption={(props, option) => (
                <MenuItem {...props}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2">{option.email}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.name}
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
              onChange={(_, newValue) => setSelectedUser(newValue?.id || null)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAddMember}
          disabled={
            loadingCreateProjectUser ||
            !selectedUser ||
            loadingUsers ||
            availableUsers.length === 0
          }
        >
          {loadingCreateProjectUser ? (
            <CircularProgress size={24} />
          ) : (
            "Add Member"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMembersDialog;
