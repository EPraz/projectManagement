import { Box, IconButton, Tooltip } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import AppearanceControl from "../appearanceControl/AppearanceControl";
import UserMenu from "../header/userMenu/UserMenu";

export type WorkspaceActionProps = {
  onRefresh?: () => void;
  refreshing?: boolean;
};
export default function WorkspaceActions({
  onRefresh,
  refreshing = false,
  rail = false,
}: WorkspaceActionProps & { rail?: boolean }) {
  return (
    <Box
      role="group"
      aria-label="Workspace controls"
      sx={{
        display: "flex",
        flexDirection: rail ? "column" : "row",
        alignItems: "center",
        gap: 1,
        ...(rail && {
          "& > button, & > span > button": {
            bgcolor: "sidebar.hover",
            color: "sidebar.text",
            borderColor: "sidebar.border",
          },
        }),
      }}
    >
      {onRefresh && (
        <Tooltip title="Refresh project" placement={rail ? "right" : "top"}>
          <span>
            <IconButton
              aria-label="Refresh project"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <AppearanceControl />
      <UserMenu rail={rail} />
    </Box>
  );
}
