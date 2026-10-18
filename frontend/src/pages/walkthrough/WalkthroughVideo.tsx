import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import walkthrough from "./walkthrough.json";

import { chapterTime } from "./chapterTime";

export default function WalkthroughVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [position, setPosition] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // A cached/fast media failure can precede React's committed event listeners.
    if (video.current?.error) setFailed(true);
  }, []);

  const seek = (seconds: number) => {
    if (!video.current) return;
    if (video.current.readyState === 0) pendingSeek.current = seconds;
    else video.current.currentTime = seconds;
    video.current.focus({ preventScroll: true });
    video.current.scrollIntoView({ block: "nearest", behavior: "instant" });
  };
  return (
    <Box component="section" aria-label="Watch the walkthrough">
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "background.paper",
          "& video": {
            display: "block",
            width: "100%",
            aspectRatio: "16/9",
            backgroundColor: "#171717",
          },
        }}
      >
        <video
          ref={video}
          aria-label="Project Management product walkthrough"
          controls
          playsInline
          preload="metadata"
          poster={walkthrough.poster}
          src={walkthrough.video}
          onError={() => setFailed(true)}
          onLoadedMetadata={() => {
            if (pendingSeek.current !== null && video.current) {
              video.current.currentTime = pendingSeek.current;
              pendingSeek.current = null;
            }
          }}
          onTimeUpdate={() => setPosition(video.current?.currentTime ?? 0)}
        />
      </Box>
      {failed && (
        <Alert
          severity="warning"
          sx={{ mt: 2 }}
          action={
            <Button
              onClick={() => {
                setFailed(false);
                video.current?.load();
              }}
            >
              Retry video
            </Button>
          }
        >
          The video could not load. Retry, download the MP4 below, or read the
          transcript.
        </Alert>
      )}
      <Typography color="text.secondary" variant="body2" sx={{ mt: 1.5 }}>
        {chapterTime(Math.ceil(walkthrough.duration))} · 1080p · Silent, with
        English text in the picture. Use the native controls for playback and
        fullscreen.
      </Typography>
      <Box component="nav" aria-label="Video chapters" sx={{ mt: 3 }}>
        <Typography component="h2" variant="h4" sx={{ mb: 1.5 }}>
          Chapters
        </Typography>
        <Box
          component="ol"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 0.5,
          }}
        >
          {walkthrough.chapters.map((chapter, index) => {
            const active =
              position >= chapter.start &&
              position < (walkthrough.chapters[index + 1]?.start ?? Infinity);
            return (
              <Box component="li" key={chapter.id}>
                <Button
                  onClick={() => seek(chapter.start)}
                  aria-current={active ? "true" : undefined}
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    gap: 1.5,
                    minHeight: 44,
                    color: active ? "primary.main" : "text.secondary",
                    bgcolor: active ? "action.selected" : undefined,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontVariantNumeric: "tabular-nums", flexShrink: 0 }}
                  >
                    {chapterTime(chapter.start)}
                  </Box>
                  <span>{chapter.title}</span>
                </Button>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
