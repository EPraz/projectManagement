import { useRef, useState } from "react";
import { useAuth } from "../../context";
import type { Ticket, TicketEditDialogProps } from "../../types";
import {
  ticketCreateFromDraft,
  ticketUpdateFromDraft,
  validateWorkItem,
} from "../../services/workItemUpdates";
import { useWorkItemEditor } from "../workItemEditor/useWorkItemEditor";
import { useEditorExit } from "../workItemEditor/useEditorExit";
export function useTicketEditor(props: TicketEditDialogProps) {
  const { user } = useAuth();
  const creating = !props.ticket?.id;
  const [tab, setTab] = useState(props.initialTab ?? 0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const exitAfterSave = useRef(props.onClose);
  const validate = (draft: Partial<Ticket>) => {
    const errors = validateWorkItem(draft);
    if (creating && !draft.sprintId && !draft.featureId)
      errors.sprintId = "Choose a sprint or feature for this ticket";
    if (
      draft.sprintId &&
      !props.sprints?.some((sprint) => sprint.id === draft.sprintId)
    )
      errors.sprintId =
        "That sprint is no longer available. Choose another sprint.";
    if (
      draft.featureId &&
      !props.features?.some((feature) => feature.id === draft.featureId)
    )
      errors.featureId =
        "That feature is no longer available. Choose another feature.";
    if (draft.dueDate && !Number.isFinite(Date.parse(draft.dueDate)))
      errors.dueDate = "Enter a valid due date";
    return errors;
  };
  const editor = useWorkItemEditor<Partial<Ticket>>(
    props.ticket ?? props.initialValues ?? null,
    props.open,
    () => exitAfterSave.current(),
    validate,
  );
  const readOnly = Boolean(props.disabled || editor.pending);
  const exit = useEditorExit({
    identity: `${props.open}:${props.ticket?.id ?? "new-ticket"}`,
    dirty: editor.dirty,
    pending: readOnly,
    onClose: props.onClose,
    onSave: () => {
      void save();
    },
    failure: editor.failure,
  });
  exitAfterSave.current = exit.finish;
  async function save() {
    if (!editor.draft || !user?.email || readOnly) return false;
    const errors = validate(editor.draft);
    if (Object.keys(errors).length)
      setTab(
        [
          "sprintId",
          "featureId",
          "dueDate",
          "storyPoints",
          "estimatedHours",
          "remainingHours",
          "completedHours",
        ].some((field) => errors[field])
          ? 1
          : 0,
      );
    return editor.save(() =>
      creating
        ? (props.onCreate?.(ticketCreateFromDraft(editor.draft!, user.email)) ??
          Promise.resolve(false))
        : props.onSave(ticketUpdateFromDraft(editor.draft!, user.email)),
    );
  }
  const change = (values: Partial<Ticket>) => {
    editor.setDraft((current) =>
      current ? { ...current, ...values } : current,
    );
    editor.setErrors((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([key]) => !(key in values)),
      ),
    );
  };
  const remove = () =>
    props.onDelete && editor.draft
      ? editor.remove(() => props.onDelete!(editor.draft!))
      : Promise.resolve(false);
  return {
    ...editor,
    creating,
    readOnly,
    tab,
    setTab,
    change,
    exit,
    save,
    remove,
    confirmDelete,
    setConfirmDelete,
  };
}
