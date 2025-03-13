import { useEffect } from "react";
import socket from "./socket";
import { Ticket } from "../../types";

const useSocketTickets = () => {
  const useSocketTicketUpdate = (onUpdate: (data: Ticket) => void) => {
    useEffect(() => {
      socket.on("ticketUpdated", onUpdate);
      return () => {
        socket.off("ticketUpdated", onUpdate);
      };
    }, [onUpdate]);
  };

  const useSocketTicketAdd = (onAdd: (data: Ticket) => void) => {
    useEffect(() => {
      socket.on("ticketCreated", onAdd);
      return () => {
        socket.off("ticketCreated", onAdd);
      };
    }, [onAdd]);
  };

  const useSocketTicketRemove = (onRemove: (data: Ticket) => void) => {
    useEffect(() => {
      socket.on("ticketDeleted", onRemove);
      return () => {
        socket.off("ticketDeleted", onRemove);
      };
    }, [onRemove]);
  };

  return { useSocketTicketUpdate, useSocketTicketAdd, useSocketTicketRemove };
};

export default useSocketTickets;
