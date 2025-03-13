import { Project, User } from "../../../types";

export const addMembersHandler = async (
  selectedUser: string | null,
  allUsers: User[],
  project: Project | null,
  setProject: (value: React.SetStateAction<Project | null>) => void,
  createProjectUser: (
    userId: string,
    projectId: string
  ) => Promise<User[] | null>,
  setMembers: (value: React.SetStateAction<User[]>) => void,
  setSelectedUser: (value: React.SetStateAction<string | null>) => void,
  setOpenDialog: (value: React.SetStateAction<boolean>) => void
) => {
  if (!selectedUser) return;
  const user = allUsers.find((u) => u.id === selectedUser);
  if (!user || !project?.id) return;

  const newUsersList = await createProjectUser(user.id, project?.id);
  if (newUsersList) {
    // setProject((prev) => {
    //   if (!prev) return prev;
    //   return { ...prev, users: newUsersList };
    // });
    setMembers(newUsersList);
    setOpenDialog(false);
    setSelectedUser(null);
  }
};
