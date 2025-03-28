import { NavigateFunction } from "react-router-dom";
import { Project, Ticket } from "../models";
import { Theme } from "@mui/material";

// Tipos reutilizables
type MenuClickHandler = (
  event: React.MouseEvent<HTMLButtonElement>,
  projectId: string
) => void;

type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;
type SetFavoriteId = React.Dispatch<React.SetStateAction<string | null>>;

// Interfaces para los componentes

export interface ProjectCardViewProps {
  project: Project;
  handleMenuClick: MenuClickHandler;
  allTickets: Ticket[];
}

export interface ProjectContainerViewProps {
  projects: Project[];
  loading: boolean;
  searchInput: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleViewChange: (newView: "grid" | "list") => void;
  view: "grid" | "list";
  canCreateProject: boolean;
  setOpenDialog: SetBoolean;
  favoriteId: string | null;
  filteredProjects: Project[];
  handleMenuClick: MenuClickHandler;
  setFavoriteId: SetFavoriteId;
  navigate: NavigateFunction;
  theme: Theme;
}

export interface ProjectEmptyViewProps {
  canCreateProject: boolean;
  setOpenDialog: SetBoolean;
}

export interface ProjectGridViewProps {
  filteredProjects: Project[];
  setFavoriteId: SetFavoriteId;
  favoriteId: string | null;
  handleMenuClick: MenuClickHandler;
}

export interface ProjectHeaderProps {
  searchInput: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleViewChange: (newView: "grid" | "list") => void;
  view: "grid" | "list";
  canCreateProject: boolean;
  setOpenDialog: SetBoolean;
}

export interface ProjectListViewProps {
  filteredProjects: Project[];
  setFavoriteId: SetFavoriteId;
  favoriteId: string | null;
  handleMenuClick: MenuClickHandler;
  navigate: NavigateFunction;
  theme: Theme;
}

export interface ProjectMenuProps {
  anchorEl: HTMLElement;
  handleMenuClose: () => void;
  asPermission: boolean;
  loading: boolean;
  handleDeleteProject: (data: { id: string }) => void;
  selectedProjectId: string | null;
}
