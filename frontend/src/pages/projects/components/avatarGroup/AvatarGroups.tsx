import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { User } from "../../../../types";

const AvatarGroupsComponent = ({
  projectUsers,
  max = 3,
}: {
  projectUsers: Pick<User, "id" | "name" | "email">[];
  max: number;
}) => {
  return (
    <AvatarGroup
      max={max}
      sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}
    >
      {projectUsers?.map((user) => (
        <Tooltip key={user.id} title={user.name}>
          <Avatar
            alt={user.name}
            sx={{
              backgroundColor: "primary.light",
              color: "primary.main",
              fontSize: 12,
            }}
          >
            {user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

export default AvatarGroupsComponent;
