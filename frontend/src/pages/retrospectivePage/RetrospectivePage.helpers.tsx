import { RetroTypes } from "../../constants";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import { User } from "../../types";
import type { RetroCard, Sprint } from "../../types";

export const getCardColor = (type: string) => {
  switch (type) {
    case RetroTypes.POSITIVE:
      return "success";
    case RetroTypes.NEGATIVE:
      return "error";
    case RetroTypes.IMPROVEMENT:
      return "warning";
    default:
      return "primary";
  }
};

export const getCardIcon = (type: string) => {
  switch (type) {
    case RetroTypes.POSITIVE:
      return <ThumbUpIcon color="success" />;
    case RetroTypes.NEGATIVE:
      return <ThumbDownIcon color="error" />;
    case RetroTypes.IMPROVEMENT:
      return <LightbulbIcon color="warning" />;
    default:
      return null;
  }
};

export const likeTogglehandler = async (
  currentUser: User | null,
  card: RetroCard,
  updateRetroCard: (
    id: string,
    data: Partial<RetroCard>
  ) => Promise<RetroCard | null>,
  sprint: Sprint | null,
  setRetroCards: (value: React.SetStateAction<RetroCard[]>) => void,
  updateListOfSprints: (updatedSprint: Sprint) => void
) => {
  if (!currentUser) return;
  const hasLiked = card.likedBy?.includes(currentUser.id);
  const updatedLikedBy = hasLiked
    ? card.likedBy.filter((id) => id !== currentUser.id)
    : [...(card.likedBy || []), currentUser.id];
  const updatedLikes = updatedLikedBy.length;
  const updated = await updateRetroCard(card.id, {
    likedBy: updatedLikedBy,
    likes: updatedLikes,
  });
  if (updated && sprint) {
    // setRetroCards((prev) =>
    //   prev.map((c) => (c.id === updated.id ? updated : c))
    // );
    // const updatedSprint: Sprint = {
    //   ...sprint,
    //   retroCard: sprint.retroCard?.map((m) =>
    //     m.id === updated.id ? updated : m
    //   ),
    // };
    // updateListOfSprints(updatedSprint);
  }
};

export const editDialogSubmit = async (
  editingCard: RetroCard | null,
  updateRetroCard: (
    id: string,
    data: Partial<RetroCard>
  ) => Promise<RetroCard | null>,
  data: Partial<RetroCard>,
  currentUser: User | null,
  setRetroCards: (value: React.SetStateAction<RetroCard[]>) => void,
  sprint: Sprint | null,
  updateListOfSprints: (updatedSprint: Sprint) => void,
  handleCloseDialog: () => void
) => {
  if (editingCard) {
    const updated = await updateRetroCard(editingCard.id, {
      ...data,
      authorId: editingCard.authorId || currentUser?.id,
    });
    if (updated && sprint) {
      // setRetroCards((prev) =>
      //   prev.map((card) => (card.id === updated.id ? updated : card))
      // );
      const updatedSprint: Sprint = {
        ...sprint,
        retroCard: sprint.retroCard?.map((m) =>
          m.id === updated.id ? updated : m
        ),
      };
      updateListOfSprints(updatedSprint);
      handleCloseDialog();
    }
  }
};

export const createDialogSubmit = async (
  sprint: Sprint | null,
  createRetroCard: (data: Partial<RetroCard>) => Promise<RetroCard | null>,
  data: Partial<RetroCard>,
  currentUser: User | null,
  setRetroCards: (value: React.SetStateAction<RetroCard[]>) => void,
  updateListOfSprints: (updatedSprint: Sprint) => void,
  handleCloseDialog: () => void
) => {
  if (!sprint?.id) return;
  const created = await createRetroCard({
    ...data,
    authorId: currentUser?.id,
    sprintId: sprint.id,
  });
  if (created) {
    // setRetroCards((prev) => [...prev, created]);
    // const updatedSprint: Sprint = {
    //   ...sprint,
    //   retroCard: [...(sprint.retroCard || []), created],
    // };
    // updateListOfSprints(updatedSprint);
    handleCloseDialog();
  }
};

export const deleteDialogSubmit = async (
  cardToDelete: RetroCard | null,
  sprint: Sprint | null,
  deleteRetroCard: (id: string) => Promise<boolean>,
  setRetroCards: (value: React.SetStateAction<RetroCard[]>) => void,
  updateListOfSprints: (updatedSprint: Sprint) => void,
  setOpenDeleteModal: (value: React.SetStateAction<boolean>) => void,
  setCardToDelete: (value: React.SetStateAction<RetroCard | null>) => void
) => {
  if (cardToDelete) {
    const success = await deleteRetroCard(cardToDelete.id);
    if (success && sprint) {
      // setRetroCards((prev) =>
      //   prev.filter((card) => card.id !== cardToDelete.id)
      // );
      const updatedSprint: Sprint = {
        ...sprint,
        retroCard: sprint.retroCard?.filter((m) => m.id !== cardToDelete.id),
      };
      updateListOfSprints(updatedSprint);
    }
  }
  setOpenDeleteModal(false);
  setCardToDelete(null);
};
