import { Project } from "../models";

export interface StyledDrawerProps {
  $IsOpen: boolean;
}

export interface SidebarProps {
  project: Project;
  onRefresh?: () => void;
  refreshing?: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
