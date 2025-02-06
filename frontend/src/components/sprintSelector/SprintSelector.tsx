import { MenuItem, Select, Typography, Box } from "@mui/material";
import { useSprint } from "../../context";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const SprintSelector = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { sprint, setSprint, sprints, loadSprints } = useSprint();

  // const mockSprints = [
  //   { id: "1", name: "Sprint 1" },
  //   { id: "2", name: "Sprint 2" },
  //   { id: "3", name: "Sprint 3" },
  // ];

  useEffect(() => {
    if (projectId) {
      loadSprints(projectId);
    }
  }, [projectId, loadSprints]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
      <Typography variant="h6" sx={{ marginRight: 2 }}>
        Active Sprint:
      </Typography>
      <Select
        value={sprint?.id || ""}
        onChange={(e) =>
          setSprint(sprints.find((s) => s.id === e.target.value)!)
        }
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select a Sprint
        </MenuItem>
        {sprints.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SprintSelector;
