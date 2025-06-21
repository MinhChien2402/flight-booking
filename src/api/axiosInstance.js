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

export default axiosInstance;