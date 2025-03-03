import { LocalizationProvider } from "@mui/x-date-pickers";
import { ProjectProvider, SprintProvider } from "../../context";
import Layout from "./Layout";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const ProjectLayout = () => {
  return (
    <ProjectProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SprintProvider>
          <Layout />
        </SprintProvider>
      </LocalizationProvider>
    </ProjectProvider>
  );
};

export default ProjectLayout;
