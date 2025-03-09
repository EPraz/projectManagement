import { Header } from "./TeamMembersPage.styles";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TeamMembersHeaderProps } from "../../types";

const TeamMembersHeader = ({ setOpenDialog }: TeamMembersHeaderProps) => {
  return (
    <Header elevation={0}>
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Team Members
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your team members and their roles
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
