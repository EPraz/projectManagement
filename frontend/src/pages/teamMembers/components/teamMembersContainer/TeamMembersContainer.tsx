import React, { useState, useMemo, useCallback } from "react";
import { Container } from "../../TeamMembersPage.styles";
import { Role } from "../../../../constants";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useTeamMembers } from "../../useTeamMembers";
import TeamMembersSearchBar from "../teamMembersSearchBar/TeamMembersSearchBar";
import TeamMembersTable from "../teamMembersTable/TeamMembersTable";
import { useTheme } from "@mui/material";
import TeamMembersHeader from "../teamMembersHeader/TeamMembersHeader";
import { Portal } from "../../../../components";
import TeamMembersMenu from "../teamMembersMenu/TeamMembersMenu";
import TeamMembersDialog from "../teamMembersDialog/TeamMembersDialog";

const TeamMembersContainer = () => {
  const theme = useTheme();
  const {
    members,
    allUsers,
    loadingUsers,
    catalogError,
    mutationError,
    loadUsers,
    addMember,
    removeMember,
    isPending
  } = useTeamMembers();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Filter state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    roles: Object.values(Role).reduce(
      (acc, role) => ({ ...acc, [role]: false }),
      {} as Record<string, boolean>
    )
  });
  const [tempFilters, setTempFilters] = useState({
    name: "",
    email: "",
    roles: Object.values(Role).reduce(
      (acc, role) => ({ ...acc, [role]: false }),
      {} as Record<string, boolean>
    )
  });

  const handleAddMember = async () => {
    if (await addMember(selectedUser)) {
      setSelectedUser(null);
      setOpenDialog(false);
    }
  };
  const handleRemoveFromProject = async () => {
    if (await removeMember(selectedMember)) {
      setAnchorEl(null);
      setSelectedMember(null);
    }
  };

  // Get available users (not already in the project)
  const availableUsers = useMemo(() => {
    const memberIds = new Set(members.map((member) => member.id));
    return allUsers.filter((user) => !memberIds.has(user.id));
  }, [allUsers, members]);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    let result = members;

    // Apply search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          (member.role && member.role.toLowerCase().includes(query))
      );
    }

    // Apply name filter
    if (filters.name) {
      const nameQuery = filters.name.toLowerCase();
      result = result.filter((member) =>
        member.name.toLowerCase().includes(nameQuery)
      );
    }

    // Apply email filter
    if (filters.email) {
      const emailQuery = filters.email.toLowerCase();
      result = result.filter((member) =>
        member.email.toLowerCase().includes(emailQuery)
      );
    }

    // Apply role filters
    const activeRoles = Object.entries(filters.roles)
      .filter(([, isActive]) => isActive)
      .map(([role]) => role);

    if (activeRoles.length > 0) {
      result = result.filter(
        (member) => member.role && activeRoles.includes(member.role)
      );
    }

    return result;
  }, [members, debouncedSearchQuery, filters]);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, memberId: string) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
      setSelectedMember(memberId);
    },
    []
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedMember(null);
  }, []);

  // Filter handlers
  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
    setTempFilters({ ...filters });
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    handleCloseFilter();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      name: "",
      email: "",
      roles: Object.values(Role).reduce(
        (acc, role) => ({ ...acc, [role]: false }),
        {} as Record<string, boolean>
      )
    };
    setTempFilters(resetFilters);
    setFilters(resetFilters);
    handleCloseFilter();
  };

  const handleRoleFilterChange = (role: string) => {
    setTempFilters((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: !prev.roles[role]
      }
    }));
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.name !== "" ||
      filters.email !== "" ||
      Object.values(filters.roles).some((isActive) => isActive)
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.name) count++;
    if (filters.email) count++;
    count += Object.values(filters.roles).filter(Boolean).length;
    return count;
  }, [filters]);

  return (
    <Container>
      <TeamMembersHeader setOpenDialog={setOpenDialog} />

      <TeamMembersSearchBar
        activeFilterCount={activeFilterCount}
        filterAnchorEl={filterAnchorEl}
        handleApplyFilters={handleApplyFilters}
        handleCloseFilter={handleCloseFilter}
        handleOpenFilter={handleOpenFilter}
        handleResetFilters={handleResetFilters}
        handleRoleFilterChange={handleRoleFilterChange}
        hasActiveFilters={hasActiveFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setTempFilters={setTempFilters}
        tempFilters={tempFilters}
        theme={theme}
      />

      <TeamMembersTable
        filteredMembers={filteredMembers}
        handleMenuClick={handleMenuClick}
        handleResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        searchQuery={searchQuery}
        theme={theme}
      />

      {anchorEl && (
        <Portal>
          <TeamMembersMenu
            anchorEl={anchorEl}
            handleMenuClose={handleMenuClose}
            selectedMember={selectedMember}
            handleRemoveFromProject={handleRemoveFromProject}
            loading={isPending(selectedMember)}
            error={mutationError}
          />
        </Portal>
      )}

      {openDialog && (
        <Portal>
          <TeamMembersDialog
            availableUsers={availableUsers}
            handleAddMember={handleAddMember}
            loadingCreateProjectUser={isPending(selectedUser)}
            catalogError={catalogError}
            mutationError={mutationError}
            onRetryUsers={loadUsers}
            loadingUsers={loadingUsers}
            openDialog={openDialog}
            selectedUser={selectedUser}
            setOpenDialog={setOpenDialog}
            setSelectedUser={setSelectedUser}
          />
        </Portal>
      )}
    </Container>
  );
};

export default TeamMembersContainer;
