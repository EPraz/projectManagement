import { MenuItem, Select, Typography, Box } from "@mui/material";
import { useSprint } from "../../context";

const SprintSelector = () => {
  const { sprint, setSprint, listOfSprints } = useSprint();

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
      <Typography variant="h6" sx={{ marginRight: 2 }}>
        Active Sprint:
      </Typography>
      <Select
        disabled={!listOfSprints}
        value={sprint?.id || ""}
        onChange={(e) =>
          setSprint(listOfSprints?.find((s) => s.id === e.target.value)!)
        }
        displayEmpty
      >
        <MenuItem value="" disabled>
          {listOfSprints ? "Select a Sprint" : "No Sprint available"}
        </MenuItem>
        {listOfSprints &&
          listOfSprints.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
      </Select>
    </Box>
  );
};

export default SprintSelector;
