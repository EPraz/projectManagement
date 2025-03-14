import { Theme } from "@mui/material";
import { User } from "../models";

type setOpenDialogType = (value: React.SetStateAction<boolean>) => void;
type searchQueryType = string;
type hasActiveFiltersType = boolean;
type themeType = Theme;
type handleResetFiltersType = () => void;

export type TeamMembersDialogProps = {
  openDialog: boolean;
  setOpenDialog: setOpenDialogType;
  loadingUsers: boolean;
  availableUsers: User[];
  setSelectedUser: (value: React.SetStateAction<string | null>) => void;
  handleAddMember: () => Promise<void>;
  loadingCreateProjectUser: boolean;
  selectedUser: string | null;
};

export type TeamMembersTableProps = {
  filteredMembers: User[];
  theme: themeType;
  handleMenuClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    memberId: string
  ) => void;
  searchQuery: searchQueryType;
  hasActiveFilters: hasActiveFiltersType;
  handleResetFilters: handleResetFiltersType;
};

export type TeamMembersMenuProps = {
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  selectedMember: string | null;
  handleRemoveFromProject: () => Promise<void>;
  loading: boolean;
};
export type TeamMembersHeaderProps = {
  setOpenDialog: setOpenDialogType;
};
export type TeamMembersSearchBarProps = {
  searchQuery: searchQueryType;
  setSearchQuery: (value: React.SetStateAction<string>) => void;
  handleOpenFilter: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hasActiveFilters: hasActiveFiltersType;
  activeFilterCount: number;
  filterAnchorEl: HTMLElement | null;
  handleCloseFilter: () => void;
  tempFilters: {
    name: string;
    email: string;
    roles: Record<string, boolean>;
  };
  setTempFilters: (
    value: React.SetStateAction<{
      name: string;
      email: string;
      roles: Record<string, boolean>;
    }>
  ) => void;
  handleRoleFilterChange: (role: string) => void;
  theme: themeType;
  handleResetFilters: handleResetFiltersType;
  handleApplyFilters: () => void;
};
