import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GroupIcon from "@mui/icons-material/Group";
import FlagIcon from "@mui/icons-material/Flag";

import { lazy, type ComponentType, type LazyExoticComponent } from "react";
const Taskboard = lazy(
  () => import("../pages/board/components/taskBoard/TaskBoard")
);
const CapacityBoard = lazy(
  () => import("../pages/board/components/capacityBoard/CapacityBoard")
);
const GoalBoard = lazy(
  () => import("../pages/board/components/goalBoard/GoalBoard")
);
const BacklogBoard = lazy(
  () => import("../pages/board/components/backlogBoard/BacklogBoard")
);

interface TabPanel {
  label: string;
  icon: JSX.Element;
  component: LazyExoticComponent<ComponentType>;
}

export const TabPanels: TabPanel[] = [
  { label: "Board", icon: <ViewKanbanIcon />, component: Taskboard },
  {
    label: "Backlog",
    icon: <FormatListBulletedIcon />,
    component: BacklogBoard
  },
  {
    label: "Capacity",
    icon: <GroupIcon />,
    component: CapacityBoard
  },
  { label: "Goals", icon: <FlagIcon />, component: GoalBoard }
];
