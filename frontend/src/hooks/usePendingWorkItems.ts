import { useRef, useState } from "react";

// Locks are synchronous; rendered pending state follows the same item IDs.
export const usePendingWorkItems = () => {
  const active = useRef(new Set<number>());
  const [pending, setPending] = useState<ReadonlySet<number>>(new Set());
  const begin = (id: number | undefined) => {
    if (id === undefined || active.current.has(id)) return false;
    active.current.add(id);
    setPending(new Set(active.current));
    return true;
  };
  const finish = (id: number | undefined) => {
    if (id === undefined) return;
    active.current.delete(id);
    setPending(new Set(active.current));
  };
  return {
    begin,
    finish,
    loading: pending.size > 0,
    isPending: (id: number | undefined) => id !== undefined && pending.has(id)
  };
};
