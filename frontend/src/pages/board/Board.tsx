import { Container } from "@mui/material";
import { Taskboard } from "..";

const Board = () => {
  return (
    <Container sx={{ width: "100%", border: "1px solid black" }}>
      <h1>Task Board</h1>
      <Taskboard />
    </Container>
  );
};

export default Board;
