import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupIcon from "@mui/icons-material/Group";
import FlagIcon from "@mui/icons-material/Flag";

import { Taskboard } from "../pages";
import BacklogBoard from "../pages/board/backlogBoard/BacklogBoard";
import CapacityBoard from "../pages/board/capacityBoard/CapacityBoard";
import GoalBoard from "../pages/board/goalBoard/GoalBoard";

interface TabPanel {
  label: string;
  icon: JSX.Element;
  component: () => JSX.Element;
}

export const TabPanels: TabPanel[] = [
  { label: "Board", icon: <ViewKanbanIcon />, component: () => <Taskboard /> },
  {
    label: "Backlog",
    icon: <FormatListBulletedIcon />,
    component: () => <BacklogBoard />,
  },
  {
    label: "Capacity",
    icon: <GroupIcon />,
    component: () => <CapacityBoard />,
  },
  { label: "Goals", icon: <FlagIcon />, component: () => <GoalBoard /> },
];
