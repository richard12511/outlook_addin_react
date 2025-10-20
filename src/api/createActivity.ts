import { OutlookActivity, CreateActivityResponse } from "../types";
import { API_BASE_URL, API_BACKUP_URL, PASSWORD, USERNAME } from "./apiConstants";

export const createActivity = async (
  activity: OutlookActivity
): Promise<CreateActivityResponse> => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  const url = `${API_BASE_URL}/OutlookAddin/CreateActivity`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/CreateActivity`;

  console.log("Making POST request to:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  console.log("POST Response status: ", response.status);

  if (!response.ok) {
    console.error("Response not OK: ", response.status, response.statusText);
    console.error("Retrying call to: ", backupUrl);
    const retryResponse = await fetch(backupUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    });

    if (!retryResponse.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: CreateActivityResponse = await retryResponse.json();
    return data;
  }

  const data: CreateActivityResponse = await response.json();
  console.log("Activity creation result: ", data);

  return data;
};
