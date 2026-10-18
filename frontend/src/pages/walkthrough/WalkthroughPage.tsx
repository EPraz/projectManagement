import { Box, Button, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ArrowForward, DownloadOutlined } from "@mui/icons-material";
import AppearanceControl from "../../components/appearanceControl/AppearanceControl";
import StudioMark from "../../components/studio/StudioMark";
import WalkthroughVideo from "./WalkthroughVideo";
import { chapterTime } from "./chapterTime";
import walkthrough from "./walkthrough.json";

export default function WalkthroughPage() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        color: "text.primary",
        px: { xs: 2, sm: 4 },
        py: 3,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: { xs: 4, md: 6 },
          }}
        >
          <Box sx={{ display: "flex", color: "primary.main" }}>
            <StudioMark />
          </Box>
          <Typography fontWeight={600} sx={{ flex: 1 }}>
            EPProject Management
          </Typography>
          <AppearanceControl />
        </Box>
        <Box component="main">
          <Typography variant="overline" color="primary.main">
            Product walkthrough / Full stack
          </Typography>
          <Typography component="h1" variant="h1" sx={{ mt: 1 }}>
            From planning to delivery.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 2, mb: 3, maxWidth: 720 }}
          >
            Follow a sprint through planning, execution and feedback — including
            real updates between independent browser sessions.
          </Typography>
          <WalkthroughVideo />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
            <Button
              component="a"
              href={walkthrough.video}
              download="project-management-walkthrough.mp4"
              startIcon={<DownloadOutlined />}
            >
              Download MP4
            </Button>
            <Button
              component="a"
              href={walkthrough.captions}
              download="project-management-walkthrough.vtt"
            >
              English captions
            </Button>
            <Button
              component="a"
              href="/walkthrough/transcript.md"
              download="project-management-transcript.md"
            >
              Download transcript
            </Button>
          </Box>
          <Divider sx={{ my: { xs: 4, md: 6 } }} />
          <Box
            component="section"
            aria-labelledby="transcript-heading"
            sx={{ maxWidth: 840 }}
          >
            <Typography id="transcript-heading" component="h2" variant="h3">
              Transcript
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Recorded with fictional data against an isolated local API and
              PostgreSQL database. Session B receives real Socket.IO events
              without a refresh.
            </Typography>
            {walkthrough.chapters.map((chapter) => (
              <Box component="section" key={chapter.id} sx={{ mb: 3 }}>
                <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
                  <Box
                    component="span"
                    sx={{
                      color: "primary.main",
                      mr: 1.5,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {chapterTime(chapter.start)}
                  </Box>{" "}
                  {chapter.title}
                </Typography>
                {chapter.captions.map((caption) => (
                  <Typography
                    key={caption}
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {caption}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box
            component="footer"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              pb: 3,
            }}
          >
            <Button
              component={Link}
              to="/projects"
              variant="contained"
              endIcon={<ArrowForward />}
            >
              Explore demo
            </Button>
            <Button
              component="a"
              href="https://github.com/EPraz/projectManagement"
            >
              View source on GitHub
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexBasis: "100%" }}
            >
              The video works independently of the API. The shared, editable
              demo may take a moment to wake on free hosting.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
