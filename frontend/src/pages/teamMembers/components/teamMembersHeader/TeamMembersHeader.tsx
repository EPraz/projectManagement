import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import type { TeamMembersHeaderProps } from "../../../../types";
export default function TeamMembersHeader({
  setOpenDialog,
}: TeamMembersHeaderProps) {
  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
    >
      <Box sx={{ flex: "1 1 240px" }}>
        <Typography variant="overline" color="primary">
          People / Project-wide
        </Typography>
        <Typography component="h1" variant="h1">
          Team Members
          <Box component="span" sx={{ color: "primary.main" }}>
            .
          </Box>
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          The people sharing this project.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
      >
        Add Member
      </Button>
    </Box>
  );
}
