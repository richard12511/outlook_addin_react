import { Project } from "../types";
import { API_BASE_URL, USERNAME, PASSWORD } from "./apiConstants";

export interface SearchProjectsResponse {
  projects: Project[];
}

export const searchProjects = async (
  code?: string,
  projectName?: string,
  projectPath?: string
): Promise<Project[]> => {
  console.log("Search for projects with: ", { code, name: projectName, path: projectPath });

  const credentials = btoa(`${USERNAME}:${PASSWORD}`);

  const params = new URLSearchParams();
  if (code) params.append("code", code);
  if (projectName) params.append("projectName", projectName);
  if (projectPath) params.append("projectPath", projectPath);

  const url = `${API_BASE_URL}/OutlookAddin/SearchProjects?${params.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: SearchProjectsResponse = await response.json();
  console.log("Projects found: ", data);

  return data.projects || [];
};
