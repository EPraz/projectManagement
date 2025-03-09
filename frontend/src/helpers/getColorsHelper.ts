import { Theme } from "@mui/material";

export const getStatusColor = (status: "Active" | "Inactive", theme: Theme) => {
  return status === "Active"
    ? theme.palette.success.main
    : theme.palette.grey[500];
};

export const getRoleColor = (role: string | undefined, theme: Theme) => {
  if (!role || !theme.palette.roleColors)
    return theme.palette.roleColors.default;
  return (
    theme.palette.roleColors[role as keyof typeof theme.palette.roleColors] ||
    theme.palette.roleColors.default
  );
};
