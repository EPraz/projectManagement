import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import {
  AuthCard,
  AuthWrapper,
  AuthLayout,
  EntryGrid,
  Form,
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
      <AuthLayout>
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Box sx={{ color: "primary.main", display: "flex" }}>
              <StudioMark />
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: { xs: 14, sm: 16 } }}>
              EPProject Management
            </Typography>
          </Box>
          <AppearanceControl />
        </Box>
        <EntryGrid>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" color="primary.main">
              A workspace for the work ahead
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 36, sm: 48, md: 60 },
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-.04em",
                mt: 2,
                maxWidth: 540,
              }}
            >
              A clear plan.
              <br />
              Room to build
              <Box component="span" sx={{ color: "primary.main" }}>
                .
              </Box>
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 3, maxWidth: 440 }}>
              Bring projects, people and sprint delivery into one shared space.
              Follow the work from the first idea to the final retrospective.
            </Typography>
            <Box sx={{ display: { xs: "none", md: "grid" }, gap: 2.5, mt: 5 }}>
              {[
                [
                  "01",
                  "Plan the next step",
                  "Connect epics, features and your backlog.",
                ],
                [
                  "02",
                  "Keep delivery moving",
                  "Track tickets and tasks through the sprint.",
                ],
                [
                  "03",
                  "Learn as a team",
                  "Review goals, capacity and retrospectives.",
                ],
              ].map(([number, title, detail]) => (
                <Box
                  key={number}
                  sx={{ display: "flex", gap: 2, alignItems: "baseline" }}
                >
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {number}
                  </Typography>
                  <Box>
                    <Typography fontWeight={500}>{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {detail}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <AuthCard elevation={0}>
            <Typography variant="overline" color="primary.main">
              Explore / Demo workspace
            </Typography>
            <Typography
              component="h2"
              sx={{ fontSize: 28, lineHeight: 1.2, fontWeight: 600, mt: 2 }}
            >
              See the work in motion.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>
              Fictional projects, a sample team and populated sprints. No
              account or email required.
            </Typography>
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
                endIcon={!loading ? <ArrowForward /> : undefined}
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
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                A shared, editable demo
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Other visitors can see your changes. Please use fictional
                information.
              </Typography>
            </Box>
          </AuthCard>
        </EntryGrid>
      </AuthLayout>
    </AuthWrapper>
  );
}
