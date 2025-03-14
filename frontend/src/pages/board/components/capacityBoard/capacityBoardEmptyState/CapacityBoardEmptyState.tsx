import { EmptyStateContainer } from "../CapacityBoard.styles";
import {
  Add as AddIcon,
  WorkOutline as WorkOutlineIcon,
} from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { Sprint } from "../../../../../types";

type CapacityBoardEmptyStateProps = {
  handleOpenAddDialog: () => void;
  sprint: Sprint | null;
};

const CapacityBoardEmptyState = ({
  handleOpenAddDialog,
  sprint,
}: CapacityBoardEmptyStateProps) => {
  return (
    <EmptyStateContainer>
      <WorkOutlineIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        No team members added yet
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 500 }}
      >
        Add team members to track capacity and workload for this sprint
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        disabled={!sprint?.id}
      >
        Add team member
      </Button>
    </EmptyStateContainer>
  );
};

export default CapacityBoardEmptyState;
