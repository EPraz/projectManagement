import {
  FavoriteButton,
  ProjectCard,
  ProjectGrid,
  ProjectStats,
} from "./ProjectsPage.styles";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { CardContent, Typography, useTheme } from "@mui/material";
import ProjectCardView from "./ProjectCardView";
import { cardVariants } from "../../../constants";
import { ProjectGridViewProps } from "../../../types";
import { formatProjectDate } from "../../../helpers";

const ProjectGridView = ({
  filteredProjects,
  setFavoriteId,
  favoriteId,
  handleMenuClick,
}: ProjectGridViewProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <ProjectGrid>
      <AnimatePresence>
        {filteredProjects.map((project, index) => (
          <ProjectCard
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

            <CardContent sx={{ flex: 1 }}>
              <ProjectCardView
                project={project}
                allTickets={project.tickets}
                handleMenuClick={handleMenuClick}
              />
            </CardContent>

            <ProjectStats>
              <Typography variant="caption" color="text.secondary">
                Created by {project.createdBy} •{" "}
                {formatProjectDate(project.createdAt)}
              </Typography>
              {project.updatedBy && (
                <Typography variant="caption" color="text.secondary">
                  Updated by {project.updatedBy}
                </Typography>
              )}
            </ProjectStats>
          </ProjectCard>
        ))}
      </AnimatePresence>
    </ProjectGrid>
  );
};

export default ProjectGridView;
