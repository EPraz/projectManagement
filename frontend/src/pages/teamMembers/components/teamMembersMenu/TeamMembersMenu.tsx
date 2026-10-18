import { useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { PersonRemoveOutlined } from "@mui/icons-material";
import type { TeamMembersMenuProps } from "../../../../types";
export default function TeamMembersMenu(props: TeamMembersMenuProps) {
  const [confirming, setConfirming] = useState(false);
  const [failure, setFailure] = useState(false);
  const active = useRef(false);
  const generation = useRef(0);
  useLayoutEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  const confirm = async () => {
    if (active.current || props.loading) return;
    active.current = true;
    const started = generation.current;
    setFailure(false);
    try {
      const confirmed = await props.handleRemoveFromProject();
      if (started === generation.current) {
        if (confirmed) props.handleMenuClose();
        else setFailure(true);
      }
    } catch {
      if (started === generation.current) setFailure(true);
    } finally {
      active.current = false;
    }
  };
  return (
    <>
      <Menu
        anchorEl={props.anchorEl}
        open={Boolean(props.anchorEl)}
        onClose={() => {
          if (!props.loading) props.handleMenuClose();
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => setConfirming(true)} disabled={props.loading}>
          <PersonRemoveOutlined fontSize="small" color="error" sx={{ mr: 1 }} />
          <Typography color="error">Remove From Project</Typography>
        </MenuItem>
      </Menu>
      <Dialog
        open={confirming}
        maxWidth="xs"
        fullWidth
        aria-labelledby="member-removal-title"
        onClose={(_, reason) => {
          if (!props.loading && reason !== "backdropClick")
            props.handleMenuClose();
        }}
      >
        <DialogTitle id="member-removal-title">
          Remove project member
        </DialogTitle>
        <DialogContent>
          {failure && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {props.error ??
                "Could not remove this project member. Please try again."}
            </Alert>
          )}
          <Typography>
            Remove <strong>{props.memberName ?? "this person"}</strong> from
            this project?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Their entry remains in the demo user catalog. This changes project
            membership.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleMenuClose} disabled={props.loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            aria-busy={props.loading}
            disabled={props.loading}
            startIcon={
              props.loading ? <CircularProgress size={18} /> : undefined
            }
            onClick={() => {
              void confirm();
            }}
          >
            Remove member
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
