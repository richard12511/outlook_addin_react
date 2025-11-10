import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

process.env.API_USERNAME = "test-user";
process.env.API_PASSWORD = "test-password";
process.env.API_BASE_URL = "http://localhost:1025";
process.env.API_BACKUP_URL = "http://localhost:1025";
