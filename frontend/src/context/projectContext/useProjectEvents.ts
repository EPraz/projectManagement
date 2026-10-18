import { useEffect } from "react";
import { Project } from "../../types/models/Project";
import { Sprint } from "../../types/models/Sprint";
import { Ticket } from "../../types/models/Ticket";
import socket from "../../hooks/webSockets/socket";

export type ProjectChange = (project: Project | null) => Project | null;

export const useProjectEvents = (
  projectId: string | undefined,
  change: (update: ProjectChange) => void,
  remove: () => void,
  reconnect: () => void
) => {
  useEffect(() => {
    const projectUpdated = (project: Project) => {
      if (project.id === projectId) change(() => project);
    };
    const projectDeleted = (project: Project) => {
      if (project.id === projectId) remove();
    };
    const ticketUpdated = (ticket: Ticket) => {
      if (ticket.projectId !== projectId) return;
      change(
        (project) =>
          project && {
            ...project,
            tickets: project.tickets.map((current) =>
              current.id === ticket.id ? ticket : current
            )
          }
      );
    };
    const ticketCreated = (ticket: Ticket) => {
      if (ticket.projectId !== projectId) return;
      change((project) =>
        !project || project.tickets.some((current) => current.id === ticket.id)
          ? project
          : { ...project, tickets: [...project.tickets, ticket] }
      );
    };
    const ticketDeleted = (ticket: Ticket) => {
      if (ticket.projectId !== projectId) return;
      change(
        (project) =>
          project && {
            ...project,
            tickets: project.tickets.filter(
              (current) => current.id !== ticket.id
            )
          }
      );
    };
    const sprintUpdated = (sprint: Sprint) => {
      if (sprint.projectId !== projectId) return;
      change(
        (project) =>
          project && {
            ...project,
            sprints: project.sprints.map((current) =>
              current.id === sprint.id ? sprint : current
            )
          }
      );
    };
    const sprintCreated = (sprint: Sprint) => {
      if (sprint.projectId !== projectId) return;
      change((project) =>
        !project || project.sprints.some((current) => current.id === sprint.id)
          ? project
          : { ...project, sprints: [...project.sprints, sprint] }
      );
    };
    const sprintDeleted = (sprint: Sprint) => {
      if (sprint.projectId !== projectId) return;
      change(
        (project) =>
          project && {
            ...project,
            sprints: project.sprints.filter(
              (current) => current.id !== sprint.id
            )
          }
      );
    };
    const onConnect = () => reconnect();
    const hierarchyChanged = (event: { projectId: string }) => {
      if (event.projectId === projectId) reconnect();
    };
    socket.on("projectUpdated", projectUpdated);
    socket.on("projectDeleted", projectDeleted);
    socket.on("ticketUpdated", ticketUpdated);
    socket.on("ticketCreated", ticketCreated);
    socket.on("ticketDeleted", ticketDeleted);
    socket.on("sprintUpdated", sprintUpdated);
    socket.on("sprintCreated", sprintCreated);
    socket.on("sprintDeleted", sprintDeleted);
    socket.on("connect", onConnect);
    socket.on("hierarchyChanged", hierarchyChanged);
    return () => {
      socket.off("projectUpdated", projectUpdated);
      socket.off("projectDeleted", projectDeleted);
      socket.off("ticketUpdated", ticketUpdated);
      socket.off("ticketCreated", ticketCreated);
      socket.off("ticketDeleted", ticketDeleted);
      socket.off("sprintUpdated", sprintUpdated);
      socket.off("sprintCreated", sprintCreated);
      socket.off("sprintDeleted", sprintDeleted);
      socket.off("connect", onConnect);
      socket.off("hierarchyChanged", hierarchyChanged);
    };
  }, [projectId, change, remove, reconnect]);
};
