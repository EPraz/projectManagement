import { useId, type ReactNode } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
export default function EditorShell({
  open,
  title,
  context,
  panelWidth = 1040,
  closeLabel,
  pending,
  onClose,
  actions,
  children,
}: {
  open: boolean;
  title: string;
  context?: ReactNode;
  panelWidth?: number;
  closeLabel: string;
  pending: boolean;
  onClose: () => void;
  actions: ReactNode;
  children: ReactNode;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const titleId = useId();
  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      maxWidth={false}
      aria-labelledby={titleId}
      onClose={(_, reason) => {
        if (!pending && reason !== "backdropClick") onClose();
      }}
      sx={{
        "& .MuiDialog-container": {
          justifyContent: "flex-end",
          p: { xs: 0, sm: 2, lg: 3 },
        },
        "& .MuiDialog-paper": {
          m: 0,
          width: { xs: "100%", sm: `min(${panelWidth}px, calc(100vw - 32px))` },
          height: {
            xs: "100dvh",
            sm: "calc(100dvh - 32px)",
            lg: "calc(100dvh - 48px)",
          },
          maxHeight: "none",
          borderRadius: { xs: 0, sm: 3 },
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        },
      }}
    >
      <DialogTitle
        id={`${titleId}-header`}
        component="div"
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            id={titleId}
            component="h2"
            sx={{ fontSize: { xs: 21, sm: 23 }, fontWeight: 600, flex: 1 }}
          >
            {title}
          </Typography>
          <IconButton
            aria-label={closeLabel}
            onClick={onClose}
            disabled={pending}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
        {context && (
          <Box
            sx={{
              color: "text.secondary",
              fontSize: 14,
              overflowWrap: "anywhere",
            }}
          >
            {context}
          </Box>
        )}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 3 }, minHeight: 0, flex: 1 }}>
        {children}
      </DialogContent>
      <DialogActions
        sx={{
          flexShrink: 0,
          bgcolor: "background.paper",
          px: { xs: 2, sm: 3 },
        }}
      >
        {actions}
      </DialogActions>
    </Dialog>
  );
}
