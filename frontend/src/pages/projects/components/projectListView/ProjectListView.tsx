import { AnimatePresence } from "framer-motion";
import {
  FavoriteButton,
  MetricBox,
  ProjectList,
  ProjectListItem,
} from "../../ProjectsPage.styles";
import { ProjectListViewProps } from "../../../../types";
import { cardVariants } from "../../../../constants";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import { formatProjectDate, getProjectProgress } from "../../../../helpers";
import AvatarGroupsComponent from "../avatarGroup/AvatarGroups";

const ProjectListView = ({
  filteredProjects,
  setFavoriteId,
  favoriteId,
  handleMenuClick,
  navigate,
  theme,
}: ProjectListViewProps) => {
  return (
    <ProjectList>
      <AnimatePresence>
        {filteredProjects.map((project, index) => (
          <ProjectListItem
            key={project.id}
            elevation={0}
            onClick={() => navigate(`/projects/${project.id}/overview`)}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <FavoriteButton
              isListView
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setFavoriteId(favoriteId === project.id ? null : project.id);
              }}
            >
              {favoriteId === project.id ? (
                <StarIcon sx={{ color: theme.palette.warning.main }} />
              ) : (
                <StarBorderIcon />
              )}
            </FavoriteButton>

            <Box sx={{ display: "flex", alignItems: "center", flex: 1, p: 2 }}>
              <Box sx={{ width: "30%", mr: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {project.description || "No description available"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  width: "40%",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Progress
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      width: 150,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={getProjectProgress(
                        project.ticketStatuses,
                        project.tickets
                      )}
                      sx={{ flex: 1, height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {getProjectProgress(
                        project.ticketStatuses,
                        project.tickets
                      )}
                      %
                    </Typography>
                  </Box>
                </Box>

                <MetricBox>
                  <AssignmentIcon className="icon" fontSize="small" />
                  <Typography variant="subtitle2">
                    {project.tickets?.length || 0}
                  </Typography>
                </MetricBox>

                <MetricBox>
                  <GroupIcon className="icon" fontSize="small" />
                  <Typography variant="subtitle2">
                    {project.users?.length || 0}
                  </Typography>
                </MetricBox>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 2,
                  width: "30%",
                }}
              >
                <AvatarGroupsComponent max={3} projectUsers={project.users} />

                <Typography variant="caption" color="text.secondary">
                  {formatProjectDate(project.createdAt)}
                </Typography>

                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, project.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>
          </ProjectListItem>
        ))}
      </AnimatePresence>
    </ProjectList>
  );
};

export default ProjectListView;
