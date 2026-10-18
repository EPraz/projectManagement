import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useProject } from "../../context/projectContext";
import { usePendingWorkItems } from "../../hooks/usePendingWorkItems";
import type { User } from "../../types/models/User";

type MemberOption = Pick<User, "id" | "name" | "email">;
const isOption = (value: unknown): value is MemberOption =>
  Boolean(value) &&
  typeof value === "object" &&
  ["id", "name", "email"].every(
    (key) => typeof (value as Record<string, unknown>)[key] === "string"
  );

export const useTeamMembers = () => {
  const { request } = useAuth();
  const { project, reloadProject } = useProject();
  const [allUsers, setAllUsers] = useState<MemberOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const active = useRef<AbortController | null>(null);
  const { begin, finish, isPending } = usePendingWorkItems<string>();
  const loadUsers = useCallback(async () => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setLoadingUsers(true);
    try {
      const data = await request<unknown>("users", {
        signal: controller.signal,
        errorMessage: "Could not load team users. Please try again."
      });
      if (!Array.isArray(data) || !data.every(isOption))
        throw new Error(
          "Could not load team users: the server returned an unexpected response."
        );
      if (!controller.signal.aborted) {
        setAllUsers(data);
        setCatalogError(null);
      }
    } catch (error) {
      if (!controller.signal.aborted)
        setCatalogError(
          error instanceof Error
            ? error.message
            : "Could not load team users. Please try again."
        );
    } finally {
      if (active.current === controller) {
        active.current = null;
        setLoadingUsers(false);
      }
    }
  }, [request]);
  useEffect(() => {
    void loadUsers();
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [loadUsers]);

  const change = async (userId: string | null, method: "POST" | "DELETE") => {
    if (!project || !userId) return false;
    const key = `${project.id}:${userId}`;
    if (!begin(key)) return false;
    setMutationError(null);
    try {
      const result = await request<unknown>(
        `projects/${project.id}/users/${userId}`,
        {
          method,
          errorMessage: "Could not change project membership. Please try again."
        }
      );
      if (
        !Array.isArray(result) ||
        !result.every(isOption) ||
        (method === "POST"
          ? !result.some((user) => user.id === userId)
          : result.some((user) => user.id === userId))
      )
        throw new Error(
          "The server did not confirm this membership change. Please refresh and try again."
        );
      await reloadProject();
      return true;
    } catch (error) {
      setMutationError(
        error instanceof Error
          ? error.message
          : "Could not change project membership. Please try again."
      );
      return false;
    } finally {
      finish(key);
    }
  };
  return {
    members: project?.users ?? [],
    allUsers,
    loadingUsers,
    catalogError,
    mutationError,
    loadUsers,
    addMember: (id: string | null) => change(id, "POST"),
    removeMember: (id: string | null) => change(id, "DELETE"),
    isPending: (id: string | null) =>
      Boolean(id) && isPending(`${project?.id}:${id}`)
  };
};
