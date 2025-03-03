import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  AvatarContainer,
  AvatarOverlay,
  Container,
  Content,
  Section,
  Sidebar,
  StyledListItem,
} from "./SettingsPage.styles";

interface UserSettings {
  name: string;
  email: string;
  avatar: string;
  notifications: {
    email: boolean;
    desktop: boolean;
    mobile: boolean;
    mentions: boolean;
    updates: boolean;
  };
  theme: "light" | "dark" | "system";
  language: string;
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
}

const mockSettings: UserSettings = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  notifications: {
    email: true,
    desktop: true,
    mobile: false,
    mentions: true,
    updates: true,
  },
  theme: "system",
  language: "en",
  security: {
    twoFactor: false,
    sessionTimeout: 30,
  },
};

const navigationItems = [
  { id: "profile", label: "Profile", icon: PersonIcon },
  { id: "notifications", label: "Notifications", icon: NotificationsIcon },
  { id: "security", label: "Security", icon: SecurityIcon },
  { id: "appearance", label: "Appearance", icon: PaletteIcon },
  { id: "language", label: "Language", icon: LanguageIcon },
];

export default function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleNotificationChange = (
    type: keyof UserSettings["notifications"]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleSave = () => {
    // Simular guardado
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setIsEditing(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Section>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h5" fontWeight="bold">
                Profile Settings
              </Typography>
              <Button
                variant="outlined"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </Box>

            {saveSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
              <AvatarContainer>
                <Avatar
                  src={settings.avatar}
                  alt={settings.name}
                  sx={{ width: 100, height: 100 }}
                />
                <AvatarOverlay className="avatar-overlay">
                  <Tooltip title="Change Avatar">
                    <IconButton size="small" sx={{ color: "white" }}>
                      <PhotoCameraIcon />
                    </IconButton>
                  </Tooltip>
                </AvatarOverlay>
              </AvatarContainer>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Profile Picture
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recommended size: 200x200px
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  sx={{ width: "fit-content" }}
                >
                  Remove
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Full Name"
                value={settings.name}
                disabled={!isEditing}
                fullWidth
                size="small"
              />
              <TextField
                label="Email Address"
                value={settings.email}
                disabled={!isEditing}
                fullWidth
                size="small"
                type="email"
              />
            </Box>
          </Section>
        );

      case "notifications":
        return (
          <Section>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Notification Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Choose how you want to receive notifications
            </Typography>

            <List>
              {Object.entries(settings.notifications).map(([key, value]) => (
                <ListItem
                  key={key}
                  sx={{
                    px: 3,
                    py: 2,
                    borderRadius: 1,
                    mb: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemText
                    primary={
                      key.charAt(0).toUpperCase() +
                      key.slice(1) +
                      " Notifications"
                    }
                    secondary={`Receive notifications via ${key}`}
                  />
                  <Switch
                    edge="end"
                    checked={value}
                    onChange={() =>
                      handleNotificationChange(
                        key as keyof UserSettings["notifications"]
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Section>
        );

      default:
        return (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              This section is under construction
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Container>
      <Sidebar elevation={0}>
        <Typography variant="h6" fontWeight="bold" sx={{ px: 2, mb: 3 }}>
          Settings
        </Typography>
        <List>
          {navigationItems.map((item) => (
            <StyledListItem
              key={item.id}
              button
              active={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </StyledListItem>
          ))}
        </List>
      </Sidebar>

      <Content elevation={0}>{renderContent()}</Content>
    </Container>
  );
}
