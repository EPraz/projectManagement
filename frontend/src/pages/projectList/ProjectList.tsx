import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../context";
import { Project } from "../../types";

const ProjectList = () => {
  const { apiUrl } = useApi();
  const [projects, setProjects] = useState<Project[]>();

  const loadProjects = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/projects/`);
      if (!response.ok) throw new Error("Failed to fetch sprints");
      const data = await response.json();
      console.log("get all projects response: ", data);
      setProjects(data);
      // if (data.length > 0) setSprints(data[0]); // selecting the recent Sprint per default
    } catch (error) {
      console.log("Error loading sprints: ", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <>
      <h1>Project List</h1>
      {projects &&
        projects.map((x) => <a href={`project/${x.id}`}>{x.title}</a>)}
    </>
  );
};

export default ProjectList;
