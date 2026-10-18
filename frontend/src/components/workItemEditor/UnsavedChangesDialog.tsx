import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
export default function UnsavedChangesDialog({
  open,
  pending,
  failure,
  onKeep,
  onDiscard,
  onSave,
}: {
  open: boolean;
  pending: boolean;
  failure?: string;
  onKeep: () => void;
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!pending) onKeep();
      }}
      aria-labelledby="unsaved-title"
      PaperProps={{ role: "alertdialog" }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="unsaved-title">Unsaved changes</DialogTitle>
      <DialogContent>
        <Typography>
          Your changes have not been saved. Keep editing, discard them, or save
          before leaving.
        </Typography>
        {failure && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {failure}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={!open || pending} onClick={onKeep}>
          Keep editing
        </Button>
        <Button disabled={!open || pending} color="error" onClick={onDiscard}>
          Discard changes
        </Button>
        <Button
          disabled={!open || pending}
          variant="contained"
          onClick={onSave}
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
