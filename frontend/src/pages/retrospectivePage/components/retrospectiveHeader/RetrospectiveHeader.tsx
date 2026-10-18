import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";
import { RetrospectiveContainerProps } from "../../../../types";
import { RetroTypes } from "../../../../constants";
import { Header } from "../../RetrospectivePage.styles";

const RetrospectiveHeader = ({
  sprint,
  currentTab,
  setCurrentTab,
  hideNames,
  setHideNames,
  handleOpenAddDialog
}: RetrospectiveContainerProps) => {
  return (
    <Header elevation={0}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          minWidth: 0
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {sprint ? `${sprint.name} Retrospective` : "Retrospective"}
        </Typography>
        <Tabs
          value={currentTab}
          onChange={(_, value) => setCurrentTab(value)}
          sx={{
            ml: { xs: 0, md: 2 },
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontSize: "0.875rem"
            }
          }}
        >
          <Tab label="Team Discussion" />
          <Tab label="Blurred feedback" />
        </Tabs>
      </Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          aria-pressed={hideNames}
          startIcon={hideNames ? <VisibilityOffIcon /> : <VisibilityIcon />}
          onClick={() => setHideNames(!hideNames)}
        >
          {hideNames ? "Show Names" : "Hide Names"}
        </Button>
        <Button
          variant="contained"
          disabled={!sprint}
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
