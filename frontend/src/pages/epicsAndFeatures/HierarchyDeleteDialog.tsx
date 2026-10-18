import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import type { HierarchyTarget } from "./types";

export const HierarchyDeleteDialog = ({
  target,
  ticketCount,
  taskCount,
  remove,
  onClose
}: {
  target: HierarchyTarget;
  ticketCount: number;
  taskCount: number;
  remove: (target: HierarchyTarget) => Promise<void>;
  onClose: () => void;
}) => {
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const active = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const confirm = async () => {
    if (active.current) return;
    active.current = true;
    setPending(true);
    setFailure("");
    try {
      await remove(target);
      if (mounted.current) onClose();
    } catch (error) {
      if (mounted.current)
        setFailure(
          error instanceof Error
            ? error.message
            : "Could not delete. Please try again."
        );
    } finally {
      active.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      aria-labelledby="hierarchy-delete-title"
      onClose={(_, reason) => {
        if (!pending && reason !== "backdropClick") onClose();
      }}
    >
      <DialogTitle id="hierarchy-delete-title">
        Delete {target.title}?
      </DialogTitle>
      <DialogContent>
        {failure && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {failure}
          </Alert>
        )}
        <DialogContentText>
          This deletes the {target.kind}
          {target.kind === "epic" ? " and its features" : ""}, including{" "}
          {ticketCount} linked tickets and {taskCount} tasks. This action cannot
          be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={pending}
          onClick={() => void confirm()}
        >
          {pending ? "Deleting…" : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
