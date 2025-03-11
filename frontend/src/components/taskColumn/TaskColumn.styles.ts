import { IconButton, TableCell } from "@mui/material";
import styled from "styled-components";

export const BodyCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  verticalAlign: "top",
  minWidth: "175px",
  maxWidth: "360px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TaskContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1),
  alignItems: "start",
  justifyContent: "center",
  width: "100%",

  gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
}));

export const AddTaskButton = styled(IconButton)(({ theme }) => ({
  height: "35px",
  width: "35px",
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "50%",
  color: theme.palette.primary.main,
  margin: `${theme.spacing(2)} auto 0`, // Centrado y espaciado superior
  display: "flex",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));
