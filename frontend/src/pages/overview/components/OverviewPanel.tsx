import type { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/material";
export default function OverviewPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card
      component="section"
      aria-label={title}
      sx={{ p: { xs: 2, sm: 3 }, minWidth: 0, height: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography component="h2" variant="h3">
          {title}
        </Typography>
        {action}
      </Box>
      {children}
    </Card>
  );
}
