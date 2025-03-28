import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { DeleteConfirmationModalProps } from "../../types";

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  itemName,
  disabled = false,
}: DeleteConfirmationModalProps) => {
  const handleSubmit = () => {
    onConfirm();
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
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
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          disabled={disabled}
        >
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
          disabled={disabled}
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
