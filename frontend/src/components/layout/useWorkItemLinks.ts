import { useCallback, useLayoutEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
// Mutations can finish after their editor unmounts. Clear only the current matching link.
export function useWorkItemLinks() {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const current = useRef(location);
  current.current = location;
  const scope = useRef(location.pathname.split("/").slice(0, 3).join("/"));
  const mounted = useRef(true);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const clear = useCallback(
    (kind: "ticketId" | "taskId", id: number) => {
      const latest = current.current;
      if (
        !mounted.current ||
        latest.pathname.split("/").slice(0, 3).join("/") !== scope.current
      )
        return;
      const params = new URLSearchParams(latest.search);
      if (params.get(kind) !== String(id)) return;
      params.delete(kind);
      if (kind === "ticketId") params.delete("ticketTab");
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );
  return {
    clearDeletedTicket: useCallback(
      (id: number) => clear("ticketId", id),
      [clear],
    ),
    clearDeletedTask: useCallback((id: number) => clear("taskId", id), [clear]),
  };
}
