import { useEffect, useId, useRef } from "react";
import { Alert, Button, Box, MenuItem, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import EditorSelect from "../../components/workItemEditor/EditorSelect";
import EditorShell from "../../components/workItemEditor/EditorShell";
import EditorNavigationGuard from "../../components/workItemEditor/EditorNavigationGuard";
import UnsavedChangesDialog from "../../components/workItemEditor/UnsavedChangesDialog";
import { useEditorExit } from "../../components/workItemEditor/useEditorExit";
import { formatStatusName } from "../../helpers";
import type { HierarchyDraft, HierarchyTarget } from "./types";

export const HierarchyEditor = ({
  target,
  parents,
  statuses,
  save,
  onClose,
}: {
  target: HierarchyTarget;
  parents: { id: string; title: string }[];
  statuses: { id: string; name: string }[];
  save: (target: HierarchyTarget, fields: HierarchyDraft) => Promise<void>;
  onClose: () => void;
}) => {
  const formId = useId();
  const mounted = useRef(true);
  const active = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<HierarchyDraft>({ defaultValues: target });
  const submit = handleSubmit(async (fields) => {
    if (active.current) return;
    active.current = true;
    try {
      await save(target, fields);
      if (mounted.current) exit.finish();
    } catch (error) {
      if (mounted.current)
        setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Could not save. Please try again.",
        });
    } finally {
      active.current = false;
    }
  });
  const exit = useEditorExit({
    identity: `${target.kind}:${target.id ?? "new"}`,
    dirty: isDirty,
    pending: isSubmitting,
    onClose,
    onSave: () => {
      void submit();
    },
    failure: errors.root?.message ?? "",
  });
  const title = `${target.id ? "Edit" : "New"} ${target.kind === "epic" ? "Epic" : "Feature"}`;
  return (
    <>
      <EditorNavigationGuard {...exit.guardProps} />
      <EditorShell
        open
        title={title}
        context={`${target.kind.toUpperCase()} / Project hierarchy`}
        closeLabel="Close hierarchy editor"
        pending={isSubmitting}
        onClose={exit.requestClose}
        actions={
          <>
            <Button disabled={isSubmitting} onClick={exit.requestClose}>
              Cancel
            </Button>
            <Button
              form={formId}
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : target.id ? "Save" : "Create"}
            </Button>
          </>
        }
      >
        <Box
          component="form"
          id={formId}
          onSubmit={submit}
          sx={{ display: "grid", gap: 3, pt: 1 }}
        >
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          <TextField
            label="Title"
            autoFocus
            fullWidth
            disabled={isSubmitting}
            {...register("title", {
              validate: (value) => Boolean(value.trim()) || "Title is required",
            })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
          {target.kind === "feature" && (
            <Controller
              control={control}
              name="parentId"
              rules={{
                validate: (value) =>
                  parents.some((parent) => parent.id === value) ||
                  "Choose an available epic",
              }}
              render={({ field }) => (
                <EditorSelect
                  label="Epic"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  error={errors.parentId?.message}
                >
                  {!parents.some((parent) => parent.id === field.value) && (
                    <MenuItem value={field.value} disabled>
                      Unavailable epic
                    </MenuItem>
                  )}
                  {parents.map((parent) => (
                    <MenuItem key={parent.id} value={parent.id}>
                      {parent.title}
                    </MenuItem>
                  ))}
                </EditorSelect>
              )}
            />
          )}
          {target.id && (
            <Controller
              control={control}
              name="statusId"
              render={({ field }) => (
                <EditorSelect
                  label="Status"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {formatStatusName(status.name)}
                    </MenuItem>
                  ))}
                </EditorSelect>
              )}
            />
          )}
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            disabled={isSubmitting}
            {...register("description")}
          />
          <TextField
            label="Acceptance Criteria"
            fullWidth
            multiline
            minRows={3}
            disabled={isSubmitting}
            {...register("acceptanceCriteria")}
          />
        </Box>
      </EditorShell>
      <UnsavedChangesDialog {...exit.warningProps} />
    </>
  );
};
