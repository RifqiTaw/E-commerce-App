import axios from "axios";

export const useApi = () => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.fakeStoreBaseUrl,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return api;
};
