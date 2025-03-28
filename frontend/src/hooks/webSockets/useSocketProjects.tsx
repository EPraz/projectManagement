import { useEffect } from "react";
import socket from "./socket";
import { Project } from "../../types";

const useSocketProjects = () => {
  const useSocketProjectUpdate = (onUpdate: (data: Project) => void) => {
    useEffect(() => {
      socket.on("projectUpdated", onUpdate);
      return () => {
        socket.off("projectUpdated", onUpdate);
      };
    }, [onUpdate]);
  };

  const useSocketProjectRemove = (onRemove: (data: Project) => void) => {
    useEffect(() => {
      socket.on("projectDeleted", onRemove);
      return () => {
        socket.off("projectDeleted", onRemove);
      };
    }, [onRemove]);
  };

  return {
    useSocketProjectUpdate,
    useSocketProjectRemove,
  };
};

export default useSocketProjects;
