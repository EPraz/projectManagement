import {
  HomeOutlined,
  ViewWeekOutlined,
  FormatListBulleted,
  LayersOutlined,
  FlagOutlined,
  GroupOutlined,
  PeopleOutline,
  ForumOutlined,
} from "@mui/icons-material";
export const projectSections = [
  { label: "Overview", group: "Project", path: "overview", icon: HomeOutlined },
  {
    label: "Taskboard",
    group: "Work",
    path: "board?tab=board",
    icon: ViewWeekOutlined,
  },
  {
    label: "Backlog",
    group: "Work",
    path: "board?tab=backlog",
    icon: FormatListBulleted,
  },
  {
    label: "Epics & Features",
    group: "Work",
    path: "epics",
    icon: LayersOutlined,
  },
  {
    label: "Goals",
    group: "Planning",
    path: "board?tab=goals",
    icon: FlagOutlined,
  },
  {
    label: "Capacity",
    group: "Planning",
    path: "board?tab=capacity",
    icon: GroupOutlined,
  },
  { label: "Team", group: "Project", path: "teammembers", icon: PeopleOutline },
  {
    label: "Retrospective",
    group: "Project",
    path: "retrospective",
    icon: ForumOutlined,
  },
];
export function currentSection(pathname: string, search: string) {
  const route = pathname.split("/").at(-1);
  const path =
    route === "board"
      ? `board?tab=${new URLSearchParams(search).get("tab") || "board"}`
      : route;
  return (
    projectSections.find((section) => section.path === path) ??
    projectSections[0]
  );
}
