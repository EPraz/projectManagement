import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useProject } from "../../context/projectContext";
import { usePendingWorkItems } from "../../hooks/usePendingWorkItems";
import type { RetroCard } from "../../types";

const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
type ReactionFailure = { cardId: string; liked: boolean; message: string };

export const useRetrospective = () => {
  const { request, user } = useAuth();
  const { project, sprint, reloadProject } = useProject();
  const { begin, finish, isPending } = usePendingWorkItems<string>();
  const [reactionError, setReactionError] = useState<ReactionFailure | null>(
    null
  );
  const scope = useRef(sprint?.id);
  scope.current = sprint?.id;
  useEffect(() => {
    setReactionError(null);
  }, [sprint?.id]);

  const confirmCard = (result: unknown, sprintId: string, id?: string) => {
    if (
      !record(result) ||
      typeof result.id !== "string" ||
      (id && result.id !== id) ||
      result.sprintId !== sprintId ||
      typeof result.content !== "string" ||
      typeof result.authorId !== "string" ||
      !Array.isArray(result.likedBy) ||
      !result.likedBy.every((id: unknown) => typeof id === "string") ||
      typeof result.likes !== "number"
    )
      throw new Error(
        "The server did not confirm this card change. Please refresh and try again."
      );
    return result;
  };
  const save = async (current: RetroCard | null, data: Partial<RetroCard>) => {
    if (!sprint) throw new Error("Select a sprint before adding feedback.");
    const key = current?.id ?? `new:${sprint.id}`;
    if (!begin(key)) return false;
    try {
      const result = await request<unknown>(
        `retrospectives${current ? `/${current.id}` : ""}`,
        {
          method: current ? "PATCH" : "POST",
          body: {
            content: data.content,
            type: data.type,
            ...(!current && { sprintId: sprint.id })
          },
          errorMessage:
            "Could not save feedback. Your changes are kept. Please try again."
        }
      );
      const confirmed = confirmCard(result, sprint.id, current?.id);
      if (
        confirmed.content !== data.content?.trim() ||
        confirmed.type !== data.type ||
        confirmed.authorId !== (current?.authorId ?? user?.id)
      )
        throw new Error(
          "The server did not confirm the saved feedback. Please refresh and try again."
        );
      await reloadProject();
      return true;
    } finally {
      finish(key);
    }
  };
  const remove = async (current: RetroCard | null) => {
    if (!current) throw new Error("Select a card to delete.");
    if (!begin(current.id)) return false;
    try {
      const result = await request<unknown>(`retrospectives/${current.id}`, {
        method: "DELETE",
        errorMessage: "Could not delete feedback. Please try again."
      });
      if (result !== true)
        throw new Error(
          "The server did not confirm deletion. Please refresh and try again."
        );
      await reloadProject();
      return true;
    } finally {
      finish(current.id);
    }
  };
  const setReaction = async (cardId: string, liked: boolean) => {
    if (!sprint || !begin(cardId)) return;
    const sprintId = sprint.id;
    setReactionError(null);
    try {
      const result = await request<unknown>(`retrospectives/${cardId}`, {
        method: "PATCH",
        body: { liked },
        errorMessage: "Could not update this reaction. Please try again."
      });
      const confirmed = confirmCard(result, sprintId, cardId);
      const reactions = confirmed.likedBy as string[];
      if (
        reactions.includes(user?.id ?? "") !== liked ||
        confirmed.likes !== new Set(reactions).size
      )
        throw new Error(
          "The server did not confirm this reaction. Please refresh and try again."
        );
      await reloadProject();
    } catch (error) {
      if (scope.current === sprintId)
        setReactionError({
          cardId,
          liked,
          message:
            error instanceof Error
              ? error.message
              : "Could not update this reaction."
        });
    } finally {
      finish(cardId);
    }
  };
  return {
    project,
    sprint,
    retroCards: sprint?.retroCard ?? [],
    save,
    remove,
    isPending,
    isSaving: (id?: string) => isPending(id ?? `new:${sprint?.id}`),
    reactionError,
    retryReaction: () =>
      reactionError && setReaction(reactionError.cardId, reactionError.liked),
    toggleReaction: (card: RetroCard) =>
      setReaction(card.id, !card.likedBy.includes(user?.id ?? ""))
  };
};
