import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TeamMembersHeaderProps } from "../../../../types";
import { Header } from "../../TeamMembersPage.styles";

const TeamMembersHeader = ({ setOpenDialog }: TeamMembersHeaderProps) => {
  return (
    <Header elevation={0}>
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Team Members
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Inspect your demo team and manage project membership.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        sx={{ height: 40 }}
      >
        Add Member
      </Button>
    </Header>
  );
};

export default TeamMembersHeader;
