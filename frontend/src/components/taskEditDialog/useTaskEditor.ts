import { useRef, useState } from "react";
import { useAuth } from "../../context";
import type { Task, TaskEditDialogProps } from "../../types";
import {
  taskUpdateFromDraft,
  validateWorkItem,
} from "../../services/workItemUpdates";
import { useWorkItemEditor } from "../workItemEditor/useWorkItemEditor";
import { useEditorExit } from "../workItemEditor/useEditorExit";
export function useTaskEditor(props: TaskEditDialogProps) {
  const { user } = useAuth();
  const creating = !props.task?.id;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const exitAfterSave = useRef(props.onClose);
  const validate = (draft: Partial<Task>) => {
    const errors = validateWorkItem(draft);
    if (
      !creating &&
      props.statuses &&
      !props.statuses.some((status) => status.id === draft.statusId)
    )
      errors.statusId = "Choose an available task status";
    return errors;
  };
  const editor = useWorkItemEditor<Partial<Task>>(
    props.task ?? props.initialValues ?? null,
    props.open,
    () => exitAfterSave.current(),
    validate,
  );
  const readOnly = Boolean(props.disabled || editor.pending);
  const exit = useEditorExit({
    identity: `${props.open}:${props.task?.id ?? "new-task"}`,
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
    const draft = editor.draft;
    return editor.save(() =>
      creating
        ? (props.onCreate?.({
            title: draft.title?.trim(),
            description: draft.description,
            createdBy: user.email,
          }) ?? Promise.resolve(false))
        : props.onSave(taskUpdateFromDraft(draft, user.email)),
    );
  }
  const change = (values: Partial<Task>) => {
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
    exit,
    save,
    remove,
    change,
    confirmDelete,
    setConfirmDelete,
  };
}
