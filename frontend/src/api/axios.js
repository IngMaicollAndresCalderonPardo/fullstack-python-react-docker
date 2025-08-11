// src/api/axios.js
import axios from "axios";

const USERS_BASE = import.meta.env.VITE_USERS_API || "http://localhost:8000";
const POSTS_BASE = import.meta.env.VITE_POSTS_API || "http://localhost:8001";

const api = axios.create({ baseURL: USERS_BASE });      // users service
export const postsApi = axios.create({ baseURL: POSTS_BASE }); // posts service

// Attach token to requests if present
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken);
postsApi.interceptors.request.use(attachToken);

export default api;
