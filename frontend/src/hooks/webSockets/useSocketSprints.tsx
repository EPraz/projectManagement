import { useEffect } from "react";
import socket from "./socket";
import { Sprint } from "../../types";

const useSocketSprints = () => {
  const useSocketSprintUpdate = (onUpdate: (data: Sprint) => void) => {
    useEffect(() => {
      socket.on("sprintUpdated", onUpdate);
      return () => {
        socket.off("sprintUpdated", onUpdate);
      };
    }, [onUpdate]);
  };

  const useSocketSprintCreate = (onAdd: (data: Sprint) => void) => {
    useEffect(() => {
      socket.on("sprintCreated", onAdd);
      return () => {
        socket.off("sprintCreated", onAdd);
      };
    }, [onAdd]);
  };

  const useSocketSprintDelete = (onRemove: (data: Sprint) => void) => {
    useEffect(() => {
      socket.on("sprintDeleted", onRemove);
      return () => {
        socket.off("sprintDeleted", onRemove);
      };
    }, [onRemove]);
  };

  return {
    useSocketSprintUpdate,
    useSocketSprintCreate,
    useSocketSprintDelete,
  };
};

export default useSocketSprints;
