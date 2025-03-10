import { Header } from "./RetrospectivePage.styles";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { RetrospectiveContainerProps } from "../../../types";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { RetroTypes } from "../../../constants";

const RetrospectiveHeader = ({
  sprint,
  currentTab,
  setCurrentTab,
  isAnonymous,
  setIsAnonymous,
  handleOpenAddDialog,
}: RetrospectiveContainerProps) => {
  return (
    <Header elevation={0}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          {sprint ? `${sprint.name} Retrospective` : "Retrospective"}
        </Typography>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setCurrentTab(value)}
          sx={{
            ml: 2,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontSize: "0.875rem",
            },
          }}
        >
          <Tab label="Team Discussion" />
          <Tab label="Anonymous Feedback" />
        </Tabs>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={isAnonymous ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          {isAnonymous ? "Show Names" : "Hide Names"}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenAddDialog(RetroTypes.POSITIVE)}
        >
          Add new card
        </Button>
      </Box>
    </Header>
  );
};

export default RetrospectiveHeader;
