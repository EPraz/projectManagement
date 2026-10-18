import type { ProjectListViewProps } from "../../../../types";
import ProjectGridView from "../projectGridView/ProjectGridView";
export default function ProjectListView(props: ProjectListViewProps) {
  return <ProjectGridView {...props} list />;
}
