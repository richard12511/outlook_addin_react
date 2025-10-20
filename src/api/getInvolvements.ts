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

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("Initial call failed, retrying at: ", backupUrl);
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
  }

  const data: GetInvolvementsResponse = await response.json();
  console.log("Involvements found: ", data);

  return data.involvements || [];
};
