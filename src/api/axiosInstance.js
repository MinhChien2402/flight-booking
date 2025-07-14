import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:7018/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Thêm interceptor để xử lý lỗi 500
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 500) {
            console.error("Server error:", error.response.data);
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý request và thêm token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); // Debug token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No token found in localStorage");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;