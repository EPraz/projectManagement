import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { DeleteConfirmationModalProps } from "../../types";

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
}) => {
  const handleSubmit = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{itemName}</strong>?
          <br />
          <br />
          <em style={{ fontSize: "smaller" }}>This action cannot be undone.</em>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          //   color="primary"
          variant="contained"
          sx={{
            backgroundColor: "green",
            color: "white",
            ":hover": { backgroundColor: "white", color: "green" },
          }}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
