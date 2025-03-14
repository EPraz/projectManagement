import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Container } from "../../TeamMembersPage.styles";
import { useProject } from "../../../../context";
import { User } from "../../../../types";
import { Role } from "../../../../constants";
import {
  useCreateProjectUser,
  useDebounce,
  useDeleteProjectUser,
  useLoadUsers,
} from "../../../../hooks";
import TeamMembersSearchBar from "../teamMembersSearchBar/TeamMembersSearchBar";
import TeamMembersTable from "../teamMembersTable/TeamMembersTable";
import { useTheme } from "@mui/material";
import { addMembersHandler } from "../../teamMembers.helpers";
import TeamMembersHeader from "../teamMembersHeader/TeamMembersHeader";
import { Portal } from "../../../../components";
import TeamMembersMenu from "../teamMembersMenu/TeamMembersMenu";
import TeamMembersDialog from "../teamMembersDialog/TeamMembersDialog";

const TeamMembersContainer = () => {
  const theme = useTheme();
  const { project, setProject } = useProject();
  const { loadUsers, loading: loadingUsers } = useLoadUsers();
  const { createProjectUser, loading: loadingCreateProjectUser } =
    useCreateProjectUser();
  const { deleteProjectUser, loading: loadingDeleteProjectUser } =
    useDeleteProjectUser();

  const [members, setMembers] = useState<User[]>(project?.users || []);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
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
    ),
  });
  const [tempFilters, setTempFilters] = useState({
    name: "",
    email: "",
    roles: Object.values(Role).reduce(
      (acc, role) => ({ ...acc, [role]: false }),
      {} as Record<string, boolean>
    ),
  });

  // Load all available users
  useEffect(() => {
    // const fetchUsers = async () => {
    //   const data = await loadUsers();
    //   setAllUsers(data);
    // };
    // fetchUsers();
    setMembers(project?.users || []);
  }, [project]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await loadUsers();
      setAllUsers(data);
    };
    fetchUsers();
  }, []);

  // Function to add a member to the project
  const handleAddMember = useCallback(async () => {
    await addMembersHandler(
      selectedUser,
      allUsers,
      project,
      setProject,
      createProjectUser,
      setMembers,
      setSelectedUser,
      setOpenDialog
    );
  }, [selectedUser, allUsers, createProjectUser, project?.id, setProject]);

  const handleRemoveFromProject = async () => {
    if (!selectedMember) return;
    const user = allUsers.find((u) => u.id === selectedMember);
    if (!user || !project?.id) return;
    await deleteProjectUser(user.id, project?.id);
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
      .filter(([_, isActive]) => isActive)
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
      ),
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
        [role]: !prev.roles[role],
      },
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
            loading={loadingDeleteProjectUser}
          />
        </Portal>
      )}

      {openDialog && (
        <Portal>
          <TeamMembersDialog
            availableUsers={availableUsers}
            handleAddMember={handleAddMember}
            loadingCreateProjectUser={loadingCreateProjectUser}
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
