import axios from "axios";

export const createApi = (baseURL) => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
  });

  // ✅ Attach token
  // api.interceptors.request.use(
  //   (config) => {
  //     if (typeof window !== "undefined") {
  //       const token = localStorage.getItem("access_token");
  //       if (token) {
  //         config.headers.Authorization = `Bearer ${token}`;
  //       }
  //     }
  //     return config;
  //   },
  //   (error) => Promise.reject(error)
  // );

  return api;
};
