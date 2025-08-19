//Types
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

export interface SearchBPsParams {
  cardCode?: string;
  name?: string;
  email?: string;
}

//API Configuration
const API_CONFIG = {
  baseUrl: "http://localhost:1025",
  endpoints: {
    searchBps: "/OutlookAddin/SearchBps",
    searchProjects: "OutlookAddin/SearchProjects",
  },
  credentials: {
    username: "un",
    password: "pw",
  },
};

//Helper function for making authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const { username, password } = API_CONFIG.credentials;
  const credentials = btoa(`${username}:${password}`);

  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

//If we get more methods needed then we may have a need for this service, but right now we just have one api call
// export const businessPartnerService = {
//   searchBusinessPartners: async (params: SearchBPsParams): Promise<SearchBPsResponse> => {
//     //Build the query params
//     const urlParams = new URLSearchParams();
//     if (params.cardCode) urlParams.append("cardCode", params.cardCode);
//     if (params.name) urlParams.append("name", params.name);
//     if (params.email) urlParams.append("email", params.email);

//     const fullUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.searchBps}?${urlParams.toString()}`;
//     console.log("Making request to:", fullUrl);

//     const response = await makeAuthenticatedRequest(fullUrl);

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("Bps found:", data);

//     return data;
//   },
// };

const searchBusinessPartners = async (params: SearchBPsParams): Promise<SearchBPsResponse> => {
  //Build the query params
  const urlParams = new URLSearchParams();
  if (params.cardCode) urlParams.append("cardCode", params.cardCode);
  if (params.name) urlParams.append("name", params.name);
  if (params.email) urlParams.append("email", params.email);

  const fullUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.searchBps}?${urlParams.toString()}`;
  console.log("Making request to:", fullUrl);

  const response = await makeAuthenticatedRequest(fullUrl);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Bps found:", data);

  return data;
};
