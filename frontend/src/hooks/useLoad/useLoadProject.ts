import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Project } from "../../types/models/Project";
import { readProjects } from "../../services/projectResponse";

export const useLoadProject = () => {
  const { request } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = useRef<AbortController | null>(null);

  const loadProjects = useCallback(async (): Promise<Project[] | null> => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setLoading(true);
    try {
      const data = readProjects(
        await request<unknown>("/projects/", {
          signal: controller.signal,
          errorMessage: "Could not load projects. Please try again.",
        }),
      );
      if (controller.signal.aborted) return null;
      setProjects(data);
      setHasLoaded(true);
      setError(null);
      return data;
    } catch (failure) {
      if (!controller.signal.aborted) {
        setError(
          failure instanceof Error
            ? failure.message
            : "Could not load projects. Please try again.",
        );
      }
      return null;
    } finally {
      if (active.current === controller) {
        active.current = null;
        setLoading(false);
      }
    }
  }, [request]);

  useEffect(() => {
    void loadProjects();
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [loadProjects]);

  return { projects, setProjects, loadProjects, loading, hasLoaded, error };
};
