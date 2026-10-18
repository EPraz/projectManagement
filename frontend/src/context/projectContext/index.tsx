import { createContext, useContext, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button } from "@mui/material";
import Loading from "../../components/loading/Loading";
import { useProjectData } from "./useProjectData";

const ProjectContext = createContext<ReturnType<typeof useProjectData> | null>(
  null,
);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useProjectData(id);
  if (data.loading) return <Loading message="Loading project…" />;
  if (!data.project && data.error)
    return (
      <Box sx={{ p: 3, maxWidth: 640, mx: "auto", mt: 8 }}>
        <Alert severity="error">
          {data.error.status === 404
            ? "Project not found. It may have been removed."
            : data.error.message}
        </Alert>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            onClick={() => {
              void data.reloadProject();
            }}
            disabled={data.refreshing}
          >
            Retry project
          </Button>
          <Button onClick={() => navigate("/projects", { replace: true })}>
            Back to projects
          </Button>
        </Box>
      </Box>
    );
  return (
    <ProjectContext.Provider value={data}>{children}</ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProject must be used within ProjectProvider");
  return context;
};
