import {
  Alert,
  Avatar,
  Box,
  Button,
  List,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography
} from "@mui/material";
import {
  Person,
  Notifications,
  Security,
  Palette,
  Language,
  Edit
} from "@mui/icons-material";
import { useAuth } from "../../context/authContext";
import {
  Container,
  Content,
  Section,
  Sidebar,
  StyledListItem
} from "./SettingsPage.styles";

const sections = [
  { label: "Profile", icon: Person },
  { label: "Notifications", icon: Notifications },
  { label: "Security", icon: Security },
  { label: "Appearance", icon: Palette },
  { label: "Language", icon: Language }
];

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <Container>
      <Sidebar elevation={0}>
        <Typography variant="h6" fontWeight="bold" sx={{ px: 2, mb: 3 }}>
          Settings
        </Typography>
        <List>
          {sections.map(({ label, icon: Icon }) => (
            <StyledListItem key={label} active={label === "Profile"} disabled>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </StyledListItem>
          ))}
        </List>
      </Sidebar>
      <Content elevation={0}>
        <Section>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              mb: 3
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Profile Settings
            </Typography>
            <Button variant="outlined" startIcon={<Edit />} disabled>
              Edit Profile
            </Button>
          </Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            You are using a shared demo identity. Profile editing,
            notifications, security, appearance and language settings are
            unavailable in this portfolio demo.
          </Alert>
          <Avatar sx={{ width: 80, height: 80, mb: 3 }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: 400
            }}
          >
            <TextField
              label="Full Name"
              value={user?.name ?? ""}
              disabled
              fullWidth
              size="small"
            />
            <TextField
              label="Email Address"
              value={user?.email ?? ""}
              disabled
              fullWidth
              size="small"
              type="email"
            />
          </Box>
        </Section>
      </Content>
    </Container>
  );
}
