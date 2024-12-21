import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token_md") || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error?.response?.status === 401 ||
      error?.response?.message === "Unauthenticated."
    ) {
      if (window.location.pathname !== "/auth/sign-in") {
        localStorage.clear();
        window.location.href = "/auth/sign-in";
      }
    } else if (error?.response?.status === 503) {
      window.location.href = "/under-construction";
    }
    return Promise.reject(error);
  }
);

export default instance;
