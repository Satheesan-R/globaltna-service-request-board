const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}