import { API_BASE_URL, PASSWORD, USERNAME } from "./apiConstants";

export interface GetInvolvementsResponse {
  involvements: string[];
}

export const getInvolvements = async (cardCode: string): Promise<string[]> => {
  console.log("in getInvolvements");
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  const params = new URLSearchParams();
  if (cardCode) params.append("cardCode", cardCode);

  const url = `${API_BASE_URL}/OutlookAddin/GetInvolvements?${params.toString()}`;
  console.log("Making request to: ", url);

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

  const data: GetInvolvementsResponse = await response.json();
  console.log("Involvements found: ", data);

  return data.involvements || [];
};
