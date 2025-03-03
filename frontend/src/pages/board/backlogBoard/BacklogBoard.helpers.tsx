import { Box, Button, Chip, IconButton } from "@mui/material";
import { Task, Ticket } from "../../../types";
import { StateIndicator, TagChip } from "./BacklogBoard.styles";
import {
  formatStatusName,
  getTypeIcon,
  truncatedTitle,
} from "../../../helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TicketType } from "../../../constants";

// Función auxiliar para determinar el ancho de la columna
export const getColumnWidth = (key: string): string => {
  switch (key) {
    case "order":
    case "id":
      return "10%";
    case "state":
      return "15%";
    case "actions":
      return "5%";
    default:
      return "auto";
  }
};

// Función para renderizar el contenido de la celda según la clave de columna
export const renderCellContent = (
  columnKey: string,
  ticket: Ticket,
  handleOpenEditTicket: (ticket: Ticket) => void,
  handleOpenDeleteTicket: (ticket: Ticket) => void
) => {
  switch (columnKey) {
    case "order":
      return ticket.order;
    case "id":
      return ticket.id;
    case "state":
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <StateIndicator statusColor={ticket.status.color} />
          {ticket.status.name}
        </Box>
      );
    case "title":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {getTypeIcon(ticket.type)}
          <Button
            variant="text"
            sx={{
              color: "black",
              ":hover": {
                background: "none",
                textDecoration: "underline",
              },
            }}
            onClick={() => handleOpenEditTicket(ticket)}
          >
            {truncatedTitle(ticket.title)}
          </Button>
        </Box>
      );
    case "priority":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {getTypeIcon(ticket.priority)}
          {ticket.priority}
        </Box>
      );
    case "tags":
      return (
        ticket.tags &&
        ticket.tags.map((tag) => <TagChip key={tag}>{tag}</TagChip>)
      );
    case "actions":
      return (
        <>
          <IconButton onClick={() => handleOpenEditTicket(ticket)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDeleteTicket(ticket)}
            size="small"
          >
            <DeleteIcon color="error" />
          </IconButton>
        </>
      );
    case "type":
      return ticket.type;
    case "assignedTo":
      return ticket.assignedUser?.name || "Unassigned";
    case "sprint":
      return ticket.sprint?.name || "No Sprint";
    case "dueDate":
      return ticket.dueDate
        ? new Date(ticket.dueDate).toLocaleDateString()
        : "No Date";
    case "estimatedHours":
      return ticket.estimatedHours || "-";
    case "remainingHours":
      return ticket.remainingHours || "-";
    case "isBlocked":
      return ticket.isBlocked ? (
        <Chip size="small" color="error" label="Blocked" />
      ) : (
        <Chip size="small" color="success" label="Clear" />
      );
    default:
      return null;
  }
};

// Función para renderizar el contenido de la celda de tarea según la clave de columna
export const renderTaskCellContent = (
  columnKey: string,
  task: Task,
  // parentTicket: Ticket,
  handleOpenEditTask: (task: Task) => void,
  handleOpenDeleteTask: (task: Task) => void
) => {
  switch (columnKey) {
    case "id":
      return <Box sx={{ paddingLeft: 0 }}>{task.id}</Box>;
    case "state":
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <StateIndicator statusColor={task.status?.color} />
          {formatStatusName(task.status?.name || "")}
        </Box>
      );
    case "title":
      return (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, paddingLeft: 0 }}
        >
          {getTypeIcon(TicketType.TASK)}
          <Button
            variant="text"
            sx={{
              color: "black",
              ":hover": {
                background: "none",
                textDecoration: "underline",
              },
            }}
            onClick={() => handleOpenEditTask(task)}
          >
            {task.title}
          </Button>
        </Box>
      );
    case "actions":
      return (
        <>
          <IconButton onClick={() => handleOpenEditTask(task)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDeleteTask(task)} size="small">
            <DeleteIcon color="error" />
          </IconButton>
        </>
      );
    // Para las demás columnas, no mostramos nada en las filas de tareas
    default:
      return null;
  }
};
