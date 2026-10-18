import type { SidebarProps } from "../../types";
import StudioRail from "../studio/StudioRail";
import ProjectNavigation from "../projectNavigation/ProjectNavigation";
export default function Sidebar({
  project,
  onRefresh,
  refreshing,
}: SidebarProps) {
  return (
    <StudioRail
      label={`${project.title} navigation`}
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <ProjectNavigation projectId={project.id} compact />
    </StudioRail>
  );
}
