import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { DeleteConfirmationModalProps } from "../../types";
import { useLayoutEffect, useRef, useState } from "react";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  itemName,
  itemKey,
  disabled = false,
}: DeleteConfirmationModalProps) => {
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const active = useRef(false);
  const generation = useRef(0);
  const identity = itemKey ?? itemName;
  useLayoutEffect(() => {
    generation.current++;
    active.current = false;
    setPending(false);
    setFailure("");
    return () => {
      generation.current++;
    };
  }, [open, identity]);
  const handleSubmit = async () => {
    if (active.current || disabled) return;
    active.current = true;
    const started = generation.current;
    setPending(true);
    setFailure("");
    try {
      const confirmed = await onConfirm();
      if (started !== generation.current) return;
      if (confirmed === false)
        setFailure("Could not delete. Please try again.");
      else onClose();
    } catch {
      if (started === generation.current)
        setFailure("Could not delete. Please try again.");
    } finally {
      if (started === generation.current) {
        active.current = false;
        setPending(false);
      }
    }
  };
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || pending) return;
        onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        {failure && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {failure}
          </Alert>
        )}
        <Typography>
          Are you sure you want to delete <strong>{itemName}</strong>?
          <br />
          <br />
          <em style={{ fontSize: "smaller" }}>This action cannot be undone.</em>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          disabled={disabled || pending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          //   color="primary"
          variant="contained"
          color="error"
          disabled={disabled || pending}
        >
          {pending ? "Deleting…" : "Proceed"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
