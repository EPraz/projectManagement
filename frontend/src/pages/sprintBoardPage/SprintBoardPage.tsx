import { Box, Container, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TaskBoard from "./TaskBoard";
// import { Container, Grid2 as Grid, Typography, Paper } from "@mui/material";
// import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
// import TicketCard from "./TicketCard";

// interface Ticket {
//   id: string;
//   title: string;
//   status: "backlog" | "sprint";
// }

const SprintBoardPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        <Tab label="TaskBoard" />
        <Tab label="Backlog" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>{activeTab === 0 ? <TaskBoard /> : <></>}</Box>
    </Container>
  );
  // const [tickets, setTickets] = useState<Ticket[]>([
  //   { id: "1", title: "Implement login", status: "backlog" },
  //   { id: "2", title: "Setup database", status: "backlog" },
  //   { id: "3", title: "Create UI components", status: "sprint" },
  // ]);

  // const moveTicket = (id: string, toSprint: boolean) => {
  //   setTickets((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.id === id
  //         ? { ...ticket, status: toSprint ? "sprint" : "backlog" }
  //         : ticket
  //     )
  //   );
  // };

  // const onDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over) return; // Fix: Si `over` es null, no hacemos nada

  //   console.log(`Ticket ${active.id} dropped on ${over.id}`);
  //   const toSprint = over.id === "sprint-column";
  //   moveTicket(active.id as string, toSprint);
  // };

  // return (
  //   <Container>
  //     <Typography variant="h4" gutterBottom>
  //       Sprint Board
  //     </Typography>
  //     <DndContext onDragEnd={onDragEnd}>
  //       <Grid container spacing={2}>
  //         {/* Backlog Column */}
  //         <Column
  //           id="backlog-column"
  //           title="Backlog"
  //           tickets={tickets.filter((t) => t.status === "backlog")}
  //         />

  //         {/* Sprint Column */}
  //         <Column
  //           id="sprint-column"
  //           title="Sprint Actual"
  //           tickets={tickets.filter((t) => t.status === "sprint")}
  //         />
  //       </Grid>
  //     </DndContext>
  //   </Container>
  // );
};

// Nuevo Componente Column que actúa como Drop Zone
// const Column = ({
//   id,
//   title,
//   tickets,
// }: {
//   id: string;
//   title: string;
//   tickets: Ticket[];
// }) => {
//   const { setNodeRef } = useDroppable({ id });

//   return (
//     <Grid size={{ xs: 6 }}>
//       <Paper
//         ref={setNodeRef}
//         elevation={3}
//         sx={{ padding: 2, minHeight: "300px" }}
//       >
//         <Typography variant="h6">{title}</Typography>
//         {tickets.map((ticket) => (
//           <TicketCard key={ticket.id} ticket={ticket} />
//         ))}
//       </Paper>
//     </Grid>
//   );
// };

export default SprintBoardPage;
