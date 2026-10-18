import { useMemo } from "react";
import { useProject } from "../../context/projectContext";
import { useAuth } from "../../context/authContext";
import type { HierarchyDraft, HierarchyTarget } from "./types";

export const useHierarchy = (query: string) => {
  const { project, reloadProject } = useProject();
  const { request, user } = useAuth();
  const epics = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (project?.epics ?? [])
      .map((epic) => ({
        ...epic,
        features: epic.features.map((feature) => ({
          ...feature,
          tickets:
            project?.tickets.filter(
              (ticket) => ticket.featureId === feature.id
            ) ?? []
        }))
      }))
      .filter(
        (epic) =>
          !search ||
          epic.title.toLowerCase().includes(search) ||
          epic.features.some(
            (feature) =>
              feature.title.toLowerCase().includes(search) ||
              feature.tickets.some((ticket) =>
                ticket.title.toLowerCase().includes(search)
              )
          )
      );
  }, [project?.epics, project?.tickets, query]);
  const save = async (target: HierarchyTarget, fields: HierarchyDraft) => {
    if (!project || !user)
      throw new Error("The project session is unavailable. Please try again.");
    const parent =
      target.kind === "epic"
        ? { projectId: project.id }
        : { epicId: fields.parentId };
    const result = await request<{
      id: string;
      title: string;
      projectId?: string;
      epicId?: string;
    }>(`${target.kind}s${target.id ? `/${target.id}` : ""}`, {
      method: target.id ? "PATCH" : "POST",
      body: {
        ...parent,
        title: fields.title.trim(),
        description: fields.description,
        acceptanceCriteria: fields.acceptanceCriteria,
        ...(target.id
          ? {
              updatedBy: user.email,
              ...(fields.statusId && { statusId: fields.statusId })
            }
          : { createdBy: user.email })
      },
      errorMessage:
        "Could not save this item. Your changes are kept. Please try again."
    });
    if (
      !result ||
      typeof result.id !== "string" ||
      typeof result.title !== "string" ||
      (target.id && result.id !== target.id) ||
      (target.kind === "epic"
        ? result.projectId !== project.id
        : result.epicId !== fields.parentId)
    )
      throw new Error(
        "The server did not confirm this item. Please refresh and try again."
      );
    await reloadProject();
  };
  const remove = async (target: HierarchyTarget) => {
    if (!target.id) throw new Error("Select an existing item to delete.");
    const result = await request<unknown>(`${target.kind}s/${target.id}`, {
      method: "DELETE",
      errorMessage: "Could not delete this item. Please try again."
    });
    if (result !== true)
      throw new Error(
        "The server did not confirm deletion. Please refresh and try again."
      );
    await reloadProject();
  };
  return { project, epics, save, remove };
};
