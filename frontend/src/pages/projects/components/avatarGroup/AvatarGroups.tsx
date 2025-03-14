import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import { User } from "../../../../types";

const AvatarGroupsComponent = ({
  projectUsers,
  max = 3,
}: {
  projectUsers: User[];
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
            src={user.email}
            alt={user.name}
            sx={{ backgroundColor: "secondary.dark" }}
          />
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

export default AvatarGroupsComponent;
