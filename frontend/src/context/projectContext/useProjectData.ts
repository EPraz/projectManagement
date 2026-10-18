import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from "react";
import { useAuth } from "../authContext";
import { Project } from "../../types/models/Project";
import { Sprint } from "../../types/models/Sprint";
import { ApiError } from "../../services/apiRequest";
import { readProject } from "../../services/projectResponse";
import { projectReducer } from "./projectState";
import { ProjectChange, useProjectEvents } from "./useProjectEvents";

export const useProjectData = (id: string | undefined) => {
  const { request } = useAuth();
  const [state, dispatch] = useReducer(projectReducer, {
    project: null,
    selectedSprintId:
      localStorage.getItem(`selectedSprintId:${id}`) ??
      localStorage.getItem("selectedSprintId")
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const active = useRef<AbortController | null>(null);
  const setProject: Dispatch<SetStateAction<Project | null>> = useCallback(
    (value) => {
      dispatch({ type: "project", value, now: Date.now() });
    },
    []
  );
  const setListOfSprints: Dispatch<SetStateAction<Sprint[]>> = useCallback(
    (value) => {
      dispatch({ type: "sprints", value, now: Date.now() });
    },
    []
  );
  const setSprint: Dispatch<SetStateAction<Sprint | null>> = useCallback(
    (value) => {
      dispatch({ type: "sprint", value, now: Date.now() });
    },
    []
  );

  const reloadProject = useCallback(async () => {
    if (!id) return;
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setLoading(true);
    try {
      const project = readProject(
        await request<unknown>(`/projects/${id}?view=workspace`, {
          signal: controller.signal,
          errorMessage: "Could not load this project. Please try again."
        })
      );
      if (project.id !== id)
        throw new ApiError(
          502,
          "The server returned an unexpected project. Please try again."
        );
      if (!controller.signal.aborted) {
        setProject(project);
        setError(null);
      }
    } catch (failure) {
      if (!controller.signal.aborted)
        setError(
          failure instanceof ApiError
            ? failure
            : new ApiError(0, "Could not load this project. Please try again.")
        );
    } finally {
      if (active.current === controller) {
        active.current = null;
        setLoading(false);
      }
    }
  }, [id, request, setProject]);

  useEffect(() => {
    void reloadProject();
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [reloadProject]);

  useEffect(() => {
    if (id && state.selectedSprintId)
      localStorage.setItem(`selectedSprintId:${id}`, state.selectedSprintId);
  }, [id, state.selectedSprintId]);

  const change = useCallback(
    (update: ProjectChange) => {
      setProject(update);
      // A socket change invalidates an in-flight snapshot; read again after that commit.
      if (active.current) void reloadProject();
    },
    [reloadProject, setProject]
  );
  const remove = useCallback(() => {
    active.current?.abort();
    active.current = null;
    setProject(null);
    setError(new ApiError(404, "Project not found. It may have been removed."));
    setLoading(false);
  }, [setProject]);
  useProjectEvents(id, change, remove, reloadProject);

  return {
    project: state.project,
    loading: !state.project && loading,
    refreshing: loading,
    error,
    reloadProject,
    setProject,
    listOfSprints: state.project?.sprints ?? [],
    setListOfSprints,
    sprint:
      state.project?.sprints.find(
        (sprint) => sprint.id === state.selectedSprintId
      ) ?? null,
    setSprint
  };
};
