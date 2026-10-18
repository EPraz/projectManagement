import { Component, Suspense, type ReactNode } from "react";
import { Alert, Box, Button } from "@mui/material";
import Loading from "../loading/Loading";

type Props = { label: string; children: ReactNode };
class SurfaceError extends Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Could not open {this.props.label}. Check your connection and reload
            this view.
          </Alert>
          <Button sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Reload view
          </Button>
        </Box>
      );
    return this.props.children;
  }
}

// A reload requests the current deployment's assets again and restores the
// existing demo session/deep link. React.lazy caches a rejected import promise.
export default function DeferredSurface({ label, children }: Props) {
  return (
    <SurfaceError label={label}>
      <Suspense
        fallback={
          <Loading
            message={`Loading ${label}…`}
            description="Preparing your view. Please wait a moment."
          />
        }
      >
        {children}
      </Suspense>
    </SurfaceError>
  );
}
