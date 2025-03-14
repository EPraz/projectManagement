import { useCallback, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";

import type { RetroCard as RetroCardModel } from "../../../../types";
import {
  // useGetRetroCards,
  useCreateRetroCard,
  useUpdateRetroCard,
  useDeleteRetroCard,
} from "../../../../hooks";
import { useSprint, useProject, useAuth } from "../../../../context";

import { formatStatusName } from "../../../../helpers";
import { retrospectiveSchema } from "../../../../validations";
import { RetroTypes } from "../../../../constants";
import Portal from "../../../../components/portal/Portal";
import SprintSelector from "../../../../components/sprintSelector/SprintSelector";
import DialogForm from "../../../../components/dialogForm/DialogForm";
import DeleteConfirmationModal from "../../../../components/deleteConfirmationModal/DeleteConfirmationModal";
import {
  createDialogSubmit,
  deleteDialogSubmit,
  editDialogSubmit,
  likeTogglehandler,
} from "../../RetrospectivePage.helpers";
import RetrospectiveHeader from "../retrospectiveHeader/RetrospectiveHeader";
import { ColumnContent, Container } from "../../RetrospectivePage.styles";
import RetrospectiveColumnsContainer from "../retrospectiveColumnsContainer/RetrospectiveColumnsContainer";
import RetrospectiveMenu from "../retrospectiveMenu/RetrospectiveMenu";

const RetrospectiveContainer = () => {
  const theme = useTheme();
  const { sprint, updateListOfSprints } = useSprint();
  const { project } = useProject();
  const { user: currentUser } = useAuth();

  // State for retrospective cards (current sprint)
  const [retroCards, setRetroCards] = useState<RetroCardModel[]>(
    sprint?.retroCard || []
  );
  const [currentTab, setCurrentTab] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // State for card menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // States for add/edit dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<RetroCardModel | null>(null);
  const [formData, setFormData] = useState<Partial<RetroCardModel>>({
    content: "",
    type: RetroTypes.POSITIVE,
  });

  // State for delete confirmation modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<RetroCardModel | null>(null);

  // API hooks for retrospectives
  // const { getRetroCards } = useGetRetroCards();
  const { createRetroCard, loading: loadingCreate } = useCreateRetroCard();
  const { updateRetroCard, loading: loadingUpdate } = useUpdateRetroCard();
  const { deleteRetroCard } = useDeleteRetroCard();

  // Load retrospectives for the current sprint
  // const fetchRetroCards = useCallback(async () => {
  //   if (!sprint?.id) return;
  //   const data = await getRetroCards(sprint.id);
  //   if (data) setRetroCards(data);
  // }, [sprint?.id, getRetroCards]);

  useEffect(() => {
    // fetchRetroCards();
    setRetroCards(sprint?.retroCard || []);
  }, [sprint]);

  // Get user names by IDs for tooltip (likes)
  const getUserNamesByIds = useCallback(
    (userIds: string[]) => {
      if (!project?.users) return [];
      return userIds
        .map((id) => {
          const user = project.users.find((u) => u.id === id);
          return user ? user.name : null;
        })
        .filter(Boolean) as string[];
    },
    [project?.users]
  );

  // Handlers for card action menu
  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, cardId: string) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
      setSelectedCardId(cardId);
    },
    [setAnchorEl, setSelectedCardId]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedCardId(null);
  }, [setAnchorEl, setSelectedCardId]);

  const handleOpenAddDialog = useCallback(
    (typeColumn: RetroTypes) => {
      setFormData({
        content: "",
        type: typeColumn,
      });
      setEditingCard(null);
      setOpenDialog(true);
    },
    [setFormData, setEditingCard, setOpenDialog]
  );

  const handleOpenEditDialog = useCallback(
    (card: RetroCardModel) => {
      setEditingCard(card);
      setFormData({
        content: card.content,
        type: card.type,
      });
      setOpenDialog(true);
    },
    [setEditingCard, setFormData, setOpenDialog]
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCard(null);
  }, [setOpenDialog, setEditingCard]);

  // Submit handler for the DialogForm (create/edit)
  const handleDialogSubmit = async (data: typeof formData) => {
    if (editingCard) {
      await editDialogSubmit(
        editingCard,
        updateRetroCard,
        data,
        currentUser,
        setRetroCards,
        sprint,
        updateListOfSprints,
        handleCloseDialog
      );
    } else {
      await createDialogSubmit(
        sprint,
        createRetroCard,
        data,
        currentUser,
        setRetroCards,
        updateListOfSprints,
        handleCloseDialog
      );
    }
  };

  // Handler for deleting a card
  const handleOpenDeleteModal = (card: RetroCardModel) => {
    setCardToDelete(card);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = useCallback(() => {
    deleteDialogSubmit(
      cardToDelete,
      sprint,
      deleteRetroCard,
      setRetroCards,
      updateListOfSprints,
      setOpenDeleteModal,
      setCardToDelete
    );
  }, [
    cardToDelete,
    sprint,
    deleteRetroCard,
    setRetroCards,
    updateListOfSprints,
    setOpenDeleteModal,
    setCardToDelete,
  ]);

  // Handler for toggling like on a card
  const handleLikeToggle = useCallback(
    async (card: RetroCardModel) => {
      await likeTogglehandler(
        currentUser,
        card,
        updateRetroCard,
        sprint,
        setRetroCards,
        updateListOfSprints
      );
    },
    [currentUser, updateRetroCard, sprint, setRetroCards, updateListOfSprints]
  );

  return (
    <Container>
      <RetrospectiveHeader
        currentTab={currentTab}
        handleOpenAddDialog={handleOpenAddDialog}
        isAnonymous={isAnonymous}
        setCurrentTab={setCurrentTab}
        setIsAnonymous={setIsAnonymous}
        sprint={sprint}
      />

      <Box sx={{ display: "flex", justifyContent: "end", gap: 1 }}>
        <SprintSelector />
      </Box>

      <ColumnContent>
        <RetrospectiveColumnsContainer
          currentTab={currentTab}
          getUserNamesByIds={getUserNamesByIds}
          handleLikeToggle={handleLikeToggle}
          handleMenuClick={handleMenuClick}
          handleOpenAddDialog={handleOpenAddDialog}
          isAnonymous={isAnonymous}
          retroCards={retroCards}
          theme={theme}
        />
      </ColumnContent>

      {anchorEl && (
        <Portal>
          <RetrospectiveMenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            handleOpenDeleteModal={handleOpenDeleteModal}
            handleOpenEditDialog={handleOpenEditDialog}
            retroCards={retroCards}
            selectedCardId={selectedCardId}
          />
        </Portal>
      )}

      {openDialog && (
        <Portal>
          <DialogForm
            key={editingCard ? editingCard.id : "new"}
            open={openDialog}
            onClose={handleCloseDialog}
            onSubmit={handleDialogSubmit}
            schema={retrospectiveSchema}
            defaultValues={formData}
            title={editingCard ? "Edit Retro Card" : "Add Retro Card"}
            disabled={loadingCreate || loadingUpdate}
            fieldConfig={{
              content: {
                label: "Content",
                type: "textarea",
                multiline: true,
                rows: 4,
              },
              type: {
                label: "Type",
                type: "select",
                placeholder: "Select type",
                options: [
                  {
                    value: RetroTypes.POSITIVE,
                    label: formatStatusName(RetroTypes.POSITIVE),
                  },
                  {
                    value: RetroTypes.NEGATIVE,
                    label: formatStatusName(RetroTypes.NEGATIVE),
                  },
                  {
                    value: RetroTypes.IMPROVEMENT,
                    label: formatStatusName(RetroTypes.IMPROVEMENT),
                  },
                ],
              },
            }}
          />
        </Portal>
      )}

      {openDeleteModal && (
        <Portal>
          <DeleteConfirmationModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            itemName={`this card by ${cardToDelete?.author.name || "Unknown"}`}
          />
        </Portal>
      )}
    </Container>
  );
};

export default RetrospectiveContainer;
