import { useRef, useState } from "react";

// Locks are synchronous; rendered pending state follows the same item IDs.
export const usePendingWorkItems = <Id extends string | number = number>() => {
  const active = useRef(new Set<Id>());
  const [pending, setPending] = useState<ReadonlySet<Id>>(new Set());
  const begin = (id: Id | undefined) => {
    if (id === undefined || active.current.has(id)) return false;
    active.current.add(id);
    setPending(new Set(active.current));
    return true;
  };
  const finish = (id: Id | undefined) => {
    if (id === undefined) return;
    active.current.delete(id);
    setPending(new Set(active.current));
  };
  return {
    begin,
    finish,
    loading: pending.size > 0,
    isPending: (id: Id | undefined) => id !== undefined && pending.has(id)
  };
};
