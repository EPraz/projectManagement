import { Project } from "../models";

export interface StyledDrawerProps {
  $IsOpen: boolean;
}

export interface SidebarProps {
  project: Project;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
