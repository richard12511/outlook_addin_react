import { BusinessPartner } from "../types";
import { API_BASE_URL, USERNAME, PASSWORD } from "./apiConstants";

export interface SearchBPsResponse {
  bps: BusinessPartner[];
}

export const searchBusinessPartners = async (
  cardCode?: string,
  name?: string,
  email?: string
): Promise<BusinessPartner[]> => {
  console.log("Searching for business partners with:", { cardCode, name, email });
  // console.log("from env:", process.env.API_USERNAME);
  // console.log("Credentials length:", credentials.length);
  console.log("from constants: ", USERNAME);
  // Create auth header
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);

  // Build query parameters
  const params = new URLSearchParams();
  if (cardCode) params.append("cardCode", cardCode);
  if (name) params.append("name", name);
  if (email) params.append("email", email);

  const url = `${API_BASE_URL}/OutlookAddin/SearchBps?${params.toString()}`;
  console.log("Making request to:", url);
  console.log(`Basic ${credentials}`);

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

  const data: SearchBPsResponse = await response.json();
  console.log("Business partners found:", data);

  return data.bps || [];
};
