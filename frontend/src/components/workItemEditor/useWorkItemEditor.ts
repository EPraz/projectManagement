import { useLayoutEffect, useRef, useState } from "react";
import { validateWorkItem } from "../../services/workItemUpdates";
import type { Task, Ticket } from "../../types";

// One draft per opened item: socket snapshots of the same item cannot erase typing.
export const useWorkItemEditor = <T extends Task | Partial<Ticket>>(
  item: T | null,
  open: boolean,
  onClose: () => void
) => {
  const [draft, setDraft] = useState<T | null>(item);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const [action, setAction] = useState<"save" | "delete" | null>(null);
  const identity = useRef<string>();
  const submitting = useRef(false);
  const generation = useRef(0);

  useLayoutEffect(() => {
    const nextIdentity = open && item ? `open:${item.id}` : "closed";
    if (identity.current === nextIdentity) return;
    identity.current = nextIdentity;
    generation.current++;
    submitting.current = false;
    setAction(null);
    setDraft(item ? { ...item } : null);
    setErrors({});
    setFailure("");
  }, [item, open]);

  useLayoutEffect(
    () => () => {
      generation.current++;
    },
    []
  );

  const perform = async (
    kind: "save" | "delete",
    submit: () => Promise<boolean>
  ) => {
    if (!draft || submitting.current) return;
    const validation = kind === "save" ? validateWorkItem(draft) : {};
    setErrors(validation);
    if (Object.keys(validation).length) {
      setFailure("Review the highlighted fields before saving.");
      return;
    }
    submitting.current = true;
    const started = generation.current;
    setAction(kind);
    setFailure("");
    try {
      const confirmed = await submit();
      if (started !== generation.current) return;
      if (confirmed) onClose();
      else
        setFailure(
          `Could not ${kind}. Your changes are kept. Please try again.`
        );
    } catch {
      if (started === generation.current)
        setFailure(
          `Could not ${kind}. Your changes are kept. Please try again.`
        );
    } finally {
      if (started === generation.current) {
        submitting.current = false;
        setAction(null);
      }
    }
  };

  return {
    draft,
    setDraft,
    errors,
    setErrors,
    failure,
    pending: action !== null,
    action,
    save: (submit: () => Promise<boolean>) => perform("save", submit),
    remove: (submit: () => Promise<boolean>) => perform("delete", submit)
  };
};
