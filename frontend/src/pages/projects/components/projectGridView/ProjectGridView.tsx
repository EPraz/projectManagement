import { CardContent } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import {
  FavoriteButton,
  ProjectCard,
  ProjectGrid,
  ProjectList,
} from "../../ProjectsPage.styles";
import type { ProjectGridViewProps } from "../../../../types";
import ProjectCardView from "../projectCardView/ProjectCardView";
export default function ProjectGridView({
  filteredProjects,
  setFavoriteId,
  favoriteId,
  handleMenuClick,
  list = false,
}: ProjectGridViewProps & { list?: boolean }) {
  const Collection = list ? ProjectList : ProjectGrid;
  return (
    <Collection>
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id}>
          <FavoriteButton
            aria-label={`Favorite ${project.title}`}
            aria-pressed={favoriteId === project.id}
            onClick={() =>
              setFavoriteId(favoriteId === project.id ? null : project.id)
            }
          >
            {favoriteId === project.id ? (
              <Star sx={{ color: "warning.main" }} />
            ) : (
              <StarBorder sx={{ color: "text.secondary" }} />
            )}
          </FavoriteButton>
          <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: 3 } }}>
            <ProjectCardView
              project={project}
              allTickets={project.tickets}
              handleMenuClick={handleMenuClick}
            />
          </CardContent>
        </ProjectCard>
      ))}
    </Collection>
  );
}
