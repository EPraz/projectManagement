import { Box, IconButton, MenuItem, TextField, styled } from "@mui/material";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
export const SelectorContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  maxWidth: 360,
  minWidth: 0,
});
export const SprintIcon = styled(CalendarMonthOutlined)(({ theme }) => ({
  color: theme.palette.primary.main,
  flexShrink: 0,
  fontSize: 22,
}));
export const SprintMenuItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  minHeight: 44,
  "&.new-sprint": {
    borderTop: `1px solid ${theme.palette.divider}`,
    color: theme.palette.primary.main,
  },
}));
export const DeleteButton = styled(IconButton)({
  marginLeft: "auto",
  flexShrink: 0,
});
export const SprintNameContainer = styled("div")({
  flex: 1,
  minWidth: 0,
  overflowWrap: "anywhere",
});
export const StyledTextField = styled(TextField)({ width: "100%" });
