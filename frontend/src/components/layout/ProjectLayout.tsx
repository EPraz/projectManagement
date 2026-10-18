import { LocalizationProvider } from "@mui/x-date-pickers";
import { ProjectProvider, SprintProvider, TicketProvider } from "../../context";
import Layout from "./Layout";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useParams } from "react-router-dom";

const ProjectLayout = () => {
  const { id } = useParams();
  return (
    <ProjectProvider key={id}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SprintProvider>
          <TicketProvider>
            <Layout />
          </TicketProvider>
        </SprintProvider>
      </LocalizationProvider>
    </ProjectProvider>
  );
};

export default ProjectLayout;
