import axios from "axios";
import { useAppStore } from "@/shared/store/useAppStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get token reliably
function getToken(): string | null {
  // 1. Try to get from Zustand store
  const storeToken = useAppStore.getState().token;
  if (storeToken) {
    return storeToken;
  }

  // 2. Try to get from localStorage (for persistence)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("app-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.state?.token || null;
      }
    } catch (e) {
      console.error("Failed to parse stored token:", e);
    }
  }

  return null;
}

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token added to request:", token.substring(0, 20) + "...");
  } else {
    console.warn("No token available for request");
  }

  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed (401). Clearing token.");
      useAppStore.getState().logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("app-storage");
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  signup: async (email: string, password: string, name: string) => {
    const response = await api.post("/auth/signup", { email, password, name });
    return response.data;
  },
  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
