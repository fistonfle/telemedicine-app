// When empty, requests go to same origin - use Vite proxy for /auth and /api in dev
export const API_URL = import.meta.env.VITE_API_URL ?? "";
// Only use mock when explicitly enabled
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
