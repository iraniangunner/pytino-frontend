import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // مثلاً https://app.pytino.com/api

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
  }
}

const api = axios.create({ baseURL: API_URL });

// ----------------------
// Request Interceptor
// ----------------------
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.requiresAuth) {
    try {
      const res = await fetch("/api/token");
      const data = await res.json();
      if (data.token) {
        config.headers.set("Authorization", `Bearer ${data.token}`);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
    }
  }
  return config;
});

// ----------------------
// Response Interceptor (Token Refresh)
// ----------------------
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/oauth/token") ||
      originalRequest.url?.includes("/login")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await fetch("/api/refresh-token", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Refresh failed");
      }

      const newToken = data.access_token;
      processQueue(null, newToken);
      isRefreshing = false;

      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(err);
    }
  },
);

export default api;

// ─────────────────────────────────────────────
// Stores API
// ─────────────────────────────────────────────
export const storesAPI = {
  // حالا نیاز به لاگین دارد — به حساب کاربری همان مشتری وصل می‌شود
  register: (data: {
    name: string;
    welcome_message?: string;
    source_type: "api_url" | "sample_json";
    api_url?: string;
    sample_json?: string;
  }) => api.post("/stores/register", data, { requiresAuth: true }),

  // فروشگاه‌های همین مشتری لاگین‌شده (نه همه‌ی فروشگاه‌ها)
  getMyStores: () => api.get("/my-stores", { requiresAuth: true }),

  // فقط ادمین لاگین‌کرده می‌تواند لیست کامل همه را ببیند
  getAll: () => api.get("/stores", { requiresAuth: true }),

  getOne: (storeId: string) => api.get(`/stores/${storeId}`),

  updatePlan: (storeId: string, plan: string) =>
    api.patch(`/stores/${storeId}/plan`, { plan }, { requiresAuth: true }),
};

// ─────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────
export const authAPI = {
  me: () => api.get("/auth/me", { requiresAuth: true }),
};

// ─────────────────────────────────────────────
// Payments API
// ─────────────────────────────────────────────
export const paymentsAPI = {
  initiate: (storeId: string, plan: "starter" | "business" | "pro") =>
    api.post(
      "/payments/initiate",
      { store_id: storeId, plan },
      { requiresAuth: true },
    ),
};

// ─────────────────────────────────────────────
// Conversations API
// ─────────────────────────────────────────────
export const conversationsAPI = {
  getSessions: (storeId: string, page = 1) =>
    api.get(`/stores/${storeId}/conversations`, {
      params: { page },
      requiresAuth: true,
    }),

  getMessages: (storeId: string, sessionId: string) =>
    api.get(`/stores/${storeId}/conversations/${sessionId}`, {
      requiresAuth: true,
    }),
};
