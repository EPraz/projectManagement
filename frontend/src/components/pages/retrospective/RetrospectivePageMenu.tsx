import { Menu, MenuItem } from "@mui/material";
import type { RetroCard as RetroCardModel } from "../../../types";

type RetrospectivePageMenuProps = {
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  retroCards: RetroCardModel[];
  handleOpenEditDialog: (card: RetroCardModel) => void;
  handleOpenDeleteModal: (card: RetroCardModel) => void;
  selectedCardId: string | null;
};

const RetrospectivePageMenu = ({
  anchorEl,
  handleMenuClose,
  retroCards,
  handleOpenEditDialog,
  handleOpenDeleteModal,
  selectedCardId,
}: RetrospectivePageMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      elevation={3}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          const card = retroCards.find((card) => card.id === selectedCardId);
          if (card) {
            handleOpenEditDialog(card);
          }
        }}
      >
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          const card = retroCards.find((card) => card.id === selectedCardId);
          if (card) {
            handleOpenDeleteModal(card);
          }
        }}
        sx={{ color: "error.main" }}
      >
        Delete
      </MenuItem>
    </Menu>
  );
};

export default RetrospectivePageMenu;
