import { tryGET } from "../util/httpUtils";
import { API_BASE_URL, API_BACKUP_URL, PASSWORD, USERNAME } from "./apiConstants";

export interface GetInvolvementsResponse {
  involvements: string[];
}

export const getInvolvements = async (cardCode: string): Promise<string[]> => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  const params = new URLSearchParams();
  if (cardCode) params.append("cardCode", cardCode);

  const url = `${API_BASE_URL}/OutlookAddin/GetInvolvements?${params.toString()}`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/GetInvolvements?${params.toString()}`;
  console.log("Making request to: ", url);

  let response = await tryGET(url, credentials);

  if (!response.ok) {
    console.log("Initial call failed, retrying at: ", backupUrl);
    response = await tryGET(backupUrl, credentials);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: GetInvolvementsResponse = await response.json();
    return data.involvements || [];
  }

  const data: GetInvolvementsResponse = await response.json();
  console.log("Involvements found: ", data);

  return data.involvements || [];
};
