import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useSprint } from "../../../context";
import { TaskCard } from "../../../components";

const TaskBoard = () => {
  const { tickets } = useSprint();

  return (
    <Container>
      <Table sx={{ width: "100%", border: "1px solid rgba(0, 0, 0, 0.2)" }}>
        <TableHead>
          <TableRow>
            <TableCell>Tickets</TableCell>
            <TableCell>Tasks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                {ticket.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default TaskBoard;
