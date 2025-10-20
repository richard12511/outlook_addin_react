import { BusinessPartner } from "../types";
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

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const retry = await fetch(backupUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!retry.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: GetBpForProjectResponse = await response.json();
    return data;
  }

  const data: GetBpForProjectResponse = await response.json();
  console.log("Bp found for project: ", data);

  return data;
};
