export interface BusinessPartner {
  CardCode: string;
  CardName: string;
  Email: string | null;
  City?: string;
  Country?: string;
  Involvements?: string[];
  ProjectCode?: string;
}

export interface SearchBPsResponse {
  bps: BusinessPartner[];
}

const API_BASE_URL = "http://localhost:1025";
const USERNAME = "SAP-Online-Tasker";
const PASSWORD = "33-wretch-z*yWv-%z&AhkS";

export const searchBusinessPartners = async (
  cardCode?: string,
  name?: string,
  email?: string
): Promise<BusinessPartner[]> => {
  console.log("Searching for business partners with:", { cardCode, name, email });

  // Create auth header
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);

  // Build query parameters
  const params = new URLSearchParams();
  if (cardCode) params.append("cardCode", cardCode);
  if (name) params.append("name", name);
  if (email) params.append("email", email);

  const url = `${API_BASE_URL}/OutlookAddin/SearchBps?${params.toString()}`;
  console.log("Making request to:", url);

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
