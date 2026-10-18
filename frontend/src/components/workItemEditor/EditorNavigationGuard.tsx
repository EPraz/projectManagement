import { useContext, useEffect, useRef, type MutableRefObject } from "react";
import { UNSAFE_DataRouterContext, useBlocker } from "react-router-dom";
export type NavigationAttempt = { proceed: () => void; reset: () => void };
type Props = {
  enabled: boolean;
  allowNavigation: MutableRefObject<boolean>;
  onBlocked: (attempt: NavigationAttempt) => void;
};
function DataNavigationGuard({ enabled, allowNavigation, onBlocked }: Props) {
  const blocker = useBlocker(() => enabled && !allowNavigation.current);
  const notify = useRef(onBlocked);
  notify.current = onBlocked;
  useEffect(() => {
    if (blocker.state === "blocked")
      notify.current({ proceed: blocker.proceed, reset: blocker.reset });
  }, [blocker]);
  return null;
}
// Small embedded consumers can still use a plain MemoryRouter; the app uses a data router.
export default function EditorNavigationGuard(props: Props) {
  const router = useContext(UNSAFE_DataRouterContext);
  return router ? <DataNavigationGuard {...props} /> : null;
}
