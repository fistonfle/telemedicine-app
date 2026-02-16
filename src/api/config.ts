/**
 * Backend base URL for API calls.
 * - For `npm run dev`: set in .env.development (VITE_API_URL=https://your-backend.com).
 * - For remote dev backend: run `npm run dev:remote` so .env.dev is loaded.
 * When empty, fetch uses relative URLs (same origin, e.g. http://localhost:5173).
 */
const raw = import.meta.env.VITE_API_URL;
export const API_URL: string = (typeof raw === "string" ? raw : "").replace(/\/+$/, "");

if (import.meta.env.DEV && !API_URL) {
  console.warn(
    "[telemedicine-app] VITE_API_URL is not set. API requests will go to the current origin (e.g. http://localhost:5173). " +
      "Set VITE_API_URL in .env.development, or run npm run dev:remote to use .env.dev."
  );
}
