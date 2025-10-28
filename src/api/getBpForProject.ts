import { BusinessPartner } from "../types";
import { tryGET } from "../util/httpUtils";
import { API_BASE_URL, API_BACKUP_URL, PASSWORD, USERNAME } from "./apiConstants";

export interface GetBpForProjectResponse {
  bp: BusinessPartner;
  involvements: string[];
}

export const getBpForProject = async (projectCode: string): Promise<GetBpForProjectResponse> => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  const params = new URLSearchParams();

  if (projectCode) params.append("projectCode", projectCode);

  const url = `${API_BASE_URL}/OutlookAddin/GetBpForProject?${params.toString()}`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/GetBpForProject?${params.toString()}`;
  console.log("Making request to: ", url);

  let response = await tryGET(url, credentials);

  if (!response.ok) {
    console.error("Response not OK: ", response.status, response.statusText);
    console.error("Retrying call to: ", backupUrl);
    response = await tryGET(backupUrl, credentials);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: GetBpForProjectResponse = await response.json();
    return data;
  }

  const data: GetBpForProjectResponse = await response.json();
  console.log("Bp found for project: ", data);

  return data;
};
