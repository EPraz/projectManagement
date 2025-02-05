import { MenuItem, Select, Typography, Box } from "@mui/material";
import { useSprint } from "../../context";

const SprintSelector = () => {
  const { sprint, setSprint } = useSprint();

  const mockSprints = [
    { id: "1", name: "Sprint 1" },
    { id: "2", name: "Sprint 2" },
    { id: "3", name: "Sprint 3" },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
      <Typography variant="h6" sx={{ marginRight: 2 }}>
        Active Sprint:
      </Typography>
      <Select
        value={sprint?.id || ""}
        onChange={(e) =>
          setSprint(mockSprints.find((s) => s.id === e.target.value)!)
        }
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select a Sprint
        </MenuItem>
        {mockSprints.map((sprint) => (
          <MenuItem key={sprint.id} value={sprint.id}>
            {sprint.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default SprintSelector;
