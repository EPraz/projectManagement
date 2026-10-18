import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { NavigationAttempt } from "./EditorNavigationGuard";
export function useEditorExit({
  identity,
  dirty,
  pending,
  onClose,
  onSave,
  failure,
}: {
  identity: string;
  dirty: boolean;
  pending: boolean;
  onClose: () => void;
  onSave: () => void;
  failure: string;
}) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const [warning, setWarning] = useState(false);
  const navigation = useRef<NavigationAttempt | null>(null);
  const continuation = useRef<(() => void) | null>(null);
  const allowNavigation = useRef(false);
  useLayoutEffect(() => {
    navigation.current = null;
    continuation.current = null;
    allowNavigation.current = false;
    setWarning(false);
  }, [identity]);
  const finish = () => {
    allowNavigation.current = true;
    setWarning(false);
    const next = navigation.current?.proceed ?? continuation.current ?? onClose;
    next();
  };
  const keep = () => {
    navigation.current?.reset();
    navigation.current = null;
    continuation.current = null;
    allowNavigation.current = false;
    setWarning(false);
  };
  const requestAction = (next: () => void) => {
    if (pending) return;
    navigation.current = null;
    continuation.current = next;
    if (dirty) setWarning(true);
    else finish();
  };
  return {
    finish,
    requestAction,
    requestClose: () => requestAction(onClose),
    guardProps: {
      enabled: dirty && !pending,
      allowNavigation,
      onBlocked: (attempt: NavigationAttempt) => {
        navigation.current = attempt;
        continuation.current = null;
        setWarning(true);
      },
    },
    warningProps: {
      open: warning,
      pending,
      failure,
      onKeep: keep,
      onDiscard: finish,
      onSave,
    },
  };
}
