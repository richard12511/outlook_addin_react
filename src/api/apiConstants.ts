export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:1025";
export const API_BACKUP_URL = process.env.API_BACKUP_URL || "http://localhost:1025";
export const USERNAME = process.env.API_USERNAME;
export const PASSWORD = process.env.API_PASSWORD;

//validate that the env variables are present
if (!USERNAME || !PASSWORD) {
  console.error("Missing required environment variables: API_USERNAME or API_PASSWORD");
}
