import { Project } from "../types";
import { tryGET } from "../util/httpUtils";
import { API_BASE_URL, API_BACKUP_URL, USERNAME, PASSWORD } from "./apiConstants";

export interface SearchProjectsResponse {
  projects: Project[];
}

export const searchProjects = async (
  projectCode?: string,
  projectName?: string,
  projectPath?: string
): Promise<Project[]> => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);

  const params = new URLSearchParams();
  if (projectCode) params.append("projectCode", projectCode);
  if (projectName) params.append("projectName", projectName);
  if (projectPath) params.append("projectPath", projectPath);

  const url = `${API_BASE_URL}/OutlookAddin/SearchProjects?${params.toString()}`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/SearchProjects?${params.toString()}`;

  let response = await tryGET(url, credentials);

  if (!response.ok) {
    response = await tryGET(backupUrl, credentials);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: SearchProjectsResponse = await response.json();
    return data.projects || [];
  }

  const data: SearchProjectsResponse = await response.json();
  console.log("Projects found: ", data);

  return data.projects || [];
};
