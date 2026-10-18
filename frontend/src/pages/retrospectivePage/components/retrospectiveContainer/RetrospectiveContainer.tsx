import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, useTheme } from "@mui/material";

import type { RetroCard as RetroCardModel } from "../../../../types";
import { useRetrospective } from "../../useRetrospective";

import { formatStatusName } from "../../../../helpers";
import { retrospectiveSchema } from "../../../../validations";
import { RetroTypes } from "../../../../constants";
import Portal from "../../../../components/portal/Portal";

import DialogForm from "../../../../components/dialogForm/DialogForm";
import DeleteConfirmationModal from "../../../../components/deleteConfirmationModal/DeleteConfirmationModal";
import RetrospectiveHeader from "../retrospectiveHeader/RetrospectiveHeader";
import { Container } from "../../RetrospectivePage.styles";
import RetrospectiveColumnsContainer from "../retrospectiveColumnsContainer/RetrospectiveColumnsContainer";
import RetrospectiveMenu from "../retrospectiveMenu/RetrospectiveMenu";

const RetrospectiveContainer = () => {
  const theme = useTheme();
  const {
    project,
    sprint,
    retroCards,
    save,
    remove,
    isPending,
    isSaving,
    reactionError,
    retryReaction,
    toggleReaction,
  } = useRetrospective();
  const currentSprint = useRef(sprint?.id);
  currentSprint.current = sprint?.id;
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(RetroTypes.POSITIVE);
  const [hideNames, setHideNames] = useState(false);

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

  useEffect(() => {
    setOpenDialog(false);
    setEditingCard(null);
    setOpenDeleteModal(false);
    setCardToDelete(null);
    setAnchorEl(null);
    setSelectedCardId(null);
  }, [sprint?.id]);

  // Get user names by IDs for tooltip (likes)
  const getUserNamesByIds = useCallback(
    (userIds: string[]) => {
      if (!project?.users) return [];
      return userIds
        .map((id) => {
          const user = project.users.find((u) => u.id === id);
          return user ? user.name : null;
        })
        .filter((name): name is string => name !== null);
    },
    [project?.users],
  );

  // Handlers for card action menu
  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, cardId: string) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
      setSelectedCardId(cardId);
    },
    [setAnchorEl, setSelectedCardId],
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
    [setFormData, setEditingCard, setOpenDialog],
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
    [setEditingCard, setFormData, setOpenDialog],
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingCard(null);
  }, [setOpenDialog, setEditingCard]);

  const handleDialogSubmit = async (data: typeof formData) => {
    const confirmed = await save(editingCard, data);
    if (confirmed && data.type && currentSprint.current === sprint?.id)
      setSelectedCategory(data.type);
    return confirmed;
  };
  const handleOpenDeleteModal = (card: RetroCardModel) => {
    setCardToDelete(card);
    setOpenDeleteModal(true);
  };
  const handleConfirmDelete = () => remove(cardToDelete);

  return (
    <Container>
      <RetrospectiveHeader
        selectedCategory={selectedCategory}
        currentTab={currentTab}
        handleOpenAddDialog={handleOpenAddDialog}
        hideNames={hideNames}
        setCurrentTab={setCurrentTab}
        setHideNames={setHideNames}
        sprint={sprint}
      />

      {reactionError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              disabled={isPending(reactionError.cardId)}
              onClick={() => void retryReaction()}
            >
              Retry reaction
            </Button>
          }
        >
          {reactionError.message}
        </Alert>
      )}
      {!sprint && (
        <Alert severity="info">
          Select a sprint to view its retrospective.
        </Alert>
      )}
      {sprint && (
        <>
          <RetrospectiveColumnsContainer
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            currentTab={currentTab}
            getUserNamesByIds={getUserNamesByIds}
            handleLikeToggle={toggleReaction}
            isPending={isPending}
            handleMenuClick={handleMenuClick}
            handleOpenAddDialog={handleOpenAddDialog}
            hideNames={hideNames}
            retroCards={retroCards}
            theme={theme}
          />
        </>
      )}

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
            key={`${sprint?.id}:${editingCard?.id ?? "new"}`}
            open={openDialog}
            onClose={handleCloseDialog}
            onSubmit={handleDialogSubmit}
            schema={retrospectiveSchema}
            defaultValues={formData}
            title={editingCard ? "Edit Retro Card" : "Add Retro Card"}
            context={sprint?.name}
            disabled={isSaving(editingCard?.id)}
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
            itemKey={cardToDelete?.id}
            disabled={cardToDelete ? isPending(cardToDelete.id) : false}
            itemName={
              hideNames
                ? "this feedback card"
                : `this card by ${cardToDelete?.author.name || "Unknown"}`
            }
          />
        </Portal>
      )}
    </Container>
  );
};

export default RetrospectiveContainer;
