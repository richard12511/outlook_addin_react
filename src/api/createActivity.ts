import { OutlookActivity, CreateActivityResponse } from "../types";
import { tryPOST } from "../util/httpUtils";
import { API_BASE_URL, API_BACKUP_URL, PASSWORD, USERNAME } from "./apiConstants";

export const createActivity = async (
  activity: OutlookActivity
): Promise<CreateActivityResponse> => {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  const url = `${API_BASE_URL}/OutlookAddin/CreateActivity`;
  const backupUrl = `${API_BACKUP_URL}/OutlookAddin/CreateActivity`;
  const bodyStr = JSON.stringify(activity);

  let response = await tryPOST(url, credentials, bodyStr);
  console.log("POST Response from createActivity status: ", response.status);

  if (!response.ok) {
    console.error("Response not OK: ", response.status, response.statusText);
    console.error("Retrying call to: ", backupUrl);
    response = await tryPOST(backupUrl, credentials, bodyStr);
  }

  if (!response.ok) {
    throw new Error(`Create Activity failed on both servers: ${response.statusText}`);
  }

  const data: CreateActivityResponse = await response.json();
  console.log("Activity creation result: ", data);

  return data;
};
