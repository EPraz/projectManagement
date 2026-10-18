import type { ReactNode } from "react";
import { Box } from "@mui/material";
import StudioMark from "./StudioMark";
import WorkspaceActions, {
  type WorkspaceActionProps,
} from "./WorkspaceActions";

export default function StudioRail({
  label,
  children,
  ...actions
}: WorkspaceActionProps & { label: string; children: ReactNode }) {
  return (
    <Box
      component="aside"
      aria-label={label}
      sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed",
        zIndex: 10,
        top: 22,
        left: 22,
        bottom: 22,
        width: 74,
        borderRadius: "19px",
        bgcolor: "sidebar.background",
        color: "#91b8ff",
        alignItems: "center",
        flexDirection: "column",
        py: 2,
        gap: 2,
      }}
    >
      <Box sx={{ flexShrink: 0, display: "flex", py: 1 }}>
        <StudioMark />
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", width: "100%" }}>
        {children}
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          pt: 1,
          borderTop: 1,
          borderColor: "sidebar.border",
        }}
      >
        <WorkspaceActions rail {...actions} />
      </Box>
    </Box>
  );
}
