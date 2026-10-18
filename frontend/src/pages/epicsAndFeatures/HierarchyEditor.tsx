import { useEffect, useRef } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type { HierarchyDraft, HierarchyTarget } from "./types";

export const HierarchyEditor = ({
  target,
  parents,
  statuses,
  save,
  onClose
}: {
  target: HierarchyTarget;
  parents: { id: string; title: string }[];
  statuses: { id: string; name: string }[];
  save: (target: HierarchyTarget, fields: HierarchyDraft) => Promise<void>;
  onClose: () => void;
}) => {
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
    formState: { errors, isSubmitting }
  } = useForm<HierarchyDraft>({ defaultValues: target });
  const submit = handleSubmit(async (fields) => {
    if (active.current) return;
    active.current = true;
    try {
      await save(target, fields);
      if (mounted.current) onClose();
    } catch (error) {
      if (mounted.current)
        setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Could not save. Please try again."
        });
    } finally {
      active.current = false;
    }
  });
  const title = `${target.id ? "Edit" : "New"} ${target.kind === "epic" ? "Epic" : "Feature"}`;
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      aria-labelledby="hierarchy-editor-title"
      onClose={(_, reason) => {
        if (!isSubmitting && reason !== "backdropClick") onClose();
      }}
    >
      <DialogTitle id="hierarchy-editor-title">{title}</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          <TextField
            label="Title"
            autoFocus
            fullWidth
            disabled={isSubmitting}
            {...register("title", {
              validate: (value) => Boolean(value.trim()) || "Title is required"
            })}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
          {target.kind === "feature" && (
            <Controller
              control={control}
              name="parentId"
              rules={{ required: "Select an epic" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Epic"
                  fullWidth
                  disabled={isSubmitting}
                  error={Boolean(errors.parentId)}
                  helperText={errors.parentId?.message}
                >
                  {parents.map((parent) => (
                    <MenuItem key={parent.id} value={parent.id}>
                      {parent.title}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
          {target.id && (
            <Controller
              control={control}
              name="statusId"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Status"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </TextField>
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
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : target.id ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
