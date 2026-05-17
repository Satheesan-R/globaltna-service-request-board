const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://globaltna-service-request-board-wfgx.onrender.com")
  .trim()
  .replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}