import {

  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";

const Sidebar = ({
  projectId,
  // onProjectCreate,
}: {
  projectId: string;
  onProjectCreate: (title: string, description: string) => void;
}) => {
  const navigate = useNavigate();
  // const [openDialog, setOpenDialog] = useState(false);

  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");

  // const handleCreate = () => {
  //   if (title.trim()) {
  //     onProjectCreate(title, description);
  //     setTitle("");
  //     setDescription("");
  //     setOpenDialog(false);
  //   }
  // };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: `/projects/${projectId}/dashboard`,
    },
    {
      text: "Task Board",
      icon: <ViewKanbanIcon />,
      path: `/projects/${projectId}/board`,
    },
    {
      text: "Retrospective",
      icon: <AssessmentIcon />,
      path: `/projects/${projectId}/retrospective`,
    },
    {
      text: "Epics & Features",
      icon: <CategoryIcon />,
      path: `/projects/${projectId}/epics`,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: "250px",
        "& .MuiDrawer-paper": { width: "250px", boxSizing: "border-box" },
      }}
    >
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItemButton key={text} onClick={() => navigate(path)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
        {/* <ListItemButton onClick={() => setOpenDialog(true)}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
          + New Project
          </Button>
        </ListItemButton> */}
      </List>

      
    </Drawer>
  );
};

export default Sidebar;
