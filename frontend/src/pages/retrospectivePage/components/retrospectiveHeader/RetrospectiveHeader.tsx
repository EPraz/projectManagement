import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { Add, Visibility, VisibilityOff } from "@mui/icons-material";
import { RetrospectiveContainerProps } from "../../../../types";
import { Header } from "../../RetrospectivePage.styles";

export default function RetrospectiveHeader({
  sprint,
  currentTab,
  setCurrentTab,
  hideNames,
  setHideNames,
  handleOpenAddDialog,
  selectedCategory,
}: RetrospectiveContainerProps) {
  return (
    <Header>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Learn & improve
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 34, md: 44 },
              fontWeight: 600,
              letterSpacing: "-.04em",
              lineHeight: 1.15,
            }}
          >
            Retrospective.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 1, overflowWrap: "anywhere" }}
          >
            {sprint
              ? `${sprint.name} · Sprint feedback`
              : "Feedback for the selected sprint"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          disabled={!sprint}
          startIcon={<Add />}
          onClick={() => handleOpenAddDialog(selectedCategory)}
        >
          Add new card
        </Button>
      </Box>
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            aria-label="Feedback display"
            variant="fullWidth"
            sx={{
              maxWidth: 390,
              width: { xs: "100%", sm: "auto" },
              "& .MuiTab-root": {
                minWidth: 0,
                px: 1.5,
                textTransform: "none",
                fontSize: 14,
              },
            }}
          >
            <Tab label="Team Discussion" />
            <Tab label="Blurred feedback" />
          </Tabs>
          <Button
            variant="outlined"
            aria-pressed={hideNames}
            startIcon={hideNames ? <VisibilityOff /> : <Visibility />}
            onClick={() => setHideNames(!hideNames)}
          >
            {hideNames ? "Show Names" : "Hide Names"}
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          Name hiding and blur change this display only. Feedback and reactions
          remain linked to their authors.
        </Typography>
      </Box>
    </Header>
  );
}
