import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/authContext";
import {
  AuthCard,
  AuthWrapper,
  Form,
  LeftSection,
  RightSection,
  WelcomeText,
} from "./InstantLogin.styles";

import AppearanceControl from "../../components/appearanceControl/AppearanceControl";
import StudioMark from "../../components/studio/StudioMark";

export default function InstantLogin() {
  const { instantLogin, loading, sessionNotice } = useAuth();
  const [error, setError] = useState("");

  const explore = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await instantLogin();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "We couldn't open the demo. Please try again in a moment.",
      );
    }
  };

  return (
    <AuthWrapper>
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <AppearanceControl />
      </Box>
      <AuthCard>
        <LeftSection>
          <WelcomeText>
            <StudioMark />
            <Typography variant="overline" component="p" sx={{ mt: 2 }}>
              Plan. Build. Deliver.
            </Typography>
            <h1>EPProject Management</h1>
            <p>
              Explore projects, plan sprints and follow work from backlog to
              delivery.
            </p>
          </WelcomeText>
        </LeftSection>
        <RightSection>
          <CardContent>
            <Typography
              component="h2"
              variant="h5"
              gutterBottom
              fontWeight={600}
            >
              Explore the demo
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              A populated workspace with fictional projects and a sample team.
              No account or email required.
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a shared, editable demo. Other visitors can see your
              changes. Please use fictional information.
            </Alert>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {sessionNotice && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {sessionNotice}
              </Alert>
            )}
            <Form onSubmit={explore} aria-busy={loading}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Opening demo…
                  </>
                ) : (
                  "Explore demo"
                )}
              </Button>
              <Typography variant="body2" color="text.secondary" role="status">
                {loading
                  ? "The server may take about a minute to wake up after inactivity. Please keep this page open."
                  : "The first visit after inactivity may take a little longer."}
              </Typography>
            </Form>
          </CardContent>
        </RightSection>
      </AuthCard>
    </AuthWrapper>
  );
}
