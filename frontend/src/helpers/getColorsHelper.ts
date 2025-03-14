import { Theme } from "@mui/material";
import { TicketPriority } from "../constants";

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

export const getPriorityColor = (priority: TicketPriority): string => {
  switch (priority) {
    // case TicketPriority.HIGHEST:
    //   return "#D32F2F" // Red
    case TicketPriority.HIGH:
      return "#F44336"; // Light Red
    case TicketPriority.MEDIUM:
      return "#FB8C00"; // Orange
    case TicketPriority.LOW:
      return "#4CAF50"; // Green
    // case TicketPriority.LOWEST:
    //   return "#2E7D32" // Dark Green
    default:
      return "#757575"; // Grey
  }
};

// export const getRandomColor = () => {
//   const colors = [
//     "primary.light",
//     "primary.main",
//     "secondary.light",
//     "secondary.main",
//     "error.light",
//     "error.main",
//   ];
//   const randomIndex = Math.floor(Math.random() * colors.length);
//   return colors[randomIndex];
// };
export const getRandomColor = (index: number): string => {
  // Definimos dos colores específicos
  const colors = ["#4CAF50", "#FF9800"];
  // Generamos un número aleatorio entre 0 y 99
  // const rand = Math.floor(Math.random() * 100);
  // Si el número es par, retornamos uno de los dos colores
  // return rand % 2 === 0 ? colors[0] : colors[1];
  return index % 2 === 0 ? colors[0] : colors[1];
};
