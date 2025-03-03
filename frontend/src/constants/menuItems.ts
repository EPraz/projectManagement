import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

// 📌 Interfaz para los ítems del menú
export interface MenuItem {
  text: string;
  icon: React.ElementType;
  path: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    text: "Overview",
    icon: DashboardIcon,
    path: "overview",
  },
  {
    text: "Board",
    icon: ViewKanbanIcon,
    path: "board",
  },
  {
    text: "Retrospective",
    icon: AssessmentIcon,
    path: "retrospective",
  },
  {
    text: "Epics & Features",
    icon: CategoryIcon,
    path: "epics",
  },
  //   {
  //     text: "Chat",
  //     icon: ChatIcon,
  //     path: "chat",
  //   },
  //   {
  //     text: "Calendar",
  //     icon: CalendarMonthIcon,
  //     path: "calendar",
  //   },
  {
    text: "Team Members",
    icon: PeopleIcon,
    path: "teammembers",
  },
  {
    text: "Settings",
    icon: SettingsIcon,
    path: "settings",
  },
];

// 📌 Interfaz para los tabs principales
export interface MainTab {
  text: string;
  path: string;
}

export const MAIN_TABS: MainTab[] = [
  {
    text: "Overview",
    path: "overview",
  },
  {
    text: "Board",
    path: "board",
  },
  {
    text: "Members",
    path: "members",
  },
  {
    text: "Files",
    path: "files",
  },
  {
    text: "Timeline",
    path: "timeline",
  },
  {
    text: "Reports",
    path: "reports",
  },
];

// 📌 Interfaz para los proyectos
export interface Project {
  name: string;
  count: number;
  color: string;
}

export const PROJECTS: Project[] = [
  { name: "ShieldSafe", count: 5, color: "#1E8E3E" },
  { name: "Quantum", count: 2, color: "#1A73E8" },
  { name: "AeroSquare", count: 7, color: "#F9AB00" },
];
