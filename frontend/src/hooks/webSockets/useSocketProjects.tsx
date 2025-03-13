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

  return {
    useSocketProjectUpdate,
  };
};

export default useSocketProjects;
