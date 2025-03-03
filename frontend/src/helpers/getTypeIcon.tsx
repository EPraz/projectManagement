import {
  BugReport as BugReportIcon,
  Build as BuildIcon,
  ViewKanban as ViewKanbanIcon,
  Science as ScienceIcon,
  TrendingUp as TrendingUpIcon,
  Task as TaskIcon,
  PriorityHigh as PriorityHighIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LowPriority as LowPriorityIcon,
} from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material";
import { TicketPriority, TicketType } from "../constants";

export const getTypeIcon = (type: TicketType | TicketPriority): JSX.Element => {
  const iconProps: SvgIconProps = {
    sx: { fontSize: 18, color: ticketColors[type] },
  };

  switch (type) {
    case TicketType.BUG:
      return <BugReportIcon {...iconProps} />;
    case TicketType.TECHNICAL:
      return <BuildIcon {...iconProps} />;
    case TicketType.PRODUCT_BACKLOG_ITEM:
      return <ViewKanbanIcon {...iconProps} />;
    case TicketType.SPIKE:
      return <ScienceIcon {...iconProps} />;
    case TicketType.IMPROVEMENT:
      return <TrendingUpIcon {...iconProps} />;
    case TicketType.TASK:
      return <TaskIcon {...iconProps} />;

    case TicketPriority.LOW:
      return <LowPriorityIcon {...iconProps} />;
    case TicketPriority.MEDIUM:
      return <WarningIcon {...iconProps} />;
    case TicketPriority.HIGH:
      return <PriorityHighIcon {...iconProps} />;
    case TicketPriority.CRITICAL:
      return <ErrorIcon {...iconProps} />;

    default:
      return <TaskIcon color="disabled" sx={{ fontSize: 18 }} />;
  }
};

export const ticketColors = {
  [TicketType.BUG]: "#D32F2F", // Rojo fuerte
  [TicketType.TECHNICAL]: "#FFA000", // Naranja
  [TicketType.PRODUCT_BACKLOG_ITEM]: "#1976D2", // Azul
  [TicketType.SPIKE]: "#7B1FA2", // Púrpura
  [TicketType.IMPROVEMENT]: "#388E3C", // Verde
  [TicketType.TASK]: "#0288D1", // Azul Claro

  [TicketPriority.LOW]: "#4CAF50", // Verde
  [TicketPriority.MEDIUM]: "#FFC107", // Amarillo
  [TicketPriority.HIGH]: "#FF5722", // Naranja intenso
  [TicketPriority.CRITICAL]: "#B71C1C", // Rojo oscuro
};
