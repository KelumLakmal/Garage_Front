import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7147/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
