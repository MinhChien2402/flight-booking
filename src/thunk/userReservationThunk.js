import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getUserReservations = createAsyncThunk(
    "userReservation/getUserReservations",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
            return rejectWithValue("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        try {
            const response = await axiosInstance.get("/Reservation/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API Response:", response.data);
            if (!Array.isArray(response.data)) {
                console.warn("Response data is not an array:", response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message, error.response?.status);
            if (error.response?.status === 401) {
                // Thử làm mới token
                const refreshToken = localStorage.getItem("refreshToken"); // Giả sử có refresh token
                if (refreshToken) {
                    try {
                        const refreshResponse = await axiosInstance.post("/auth/refresh", { refreshToken });
                        localStorage.setItem("token", refreshResponse.data.token);
                        // Thử lại yêu cầu
                        const retryResponse = await axiosInstance.get("/Reservation/user", {
                            headers: { Authorization: `Bearer ${refreshResponse.data.token}` },
                        });
                        return retryResponse.data;
                    } catch (refreshError) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("refreshToken");
                        window.location.href = "/login";
                        return rejectWithValue("Không thể làm mới token. Vui lòng đăng nhập lại.");
                    }
                }
                localStorage.removeItem("token");
                window.location.href = "/login";
                return rejectWithValue("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi lấy danh sách đặt chỗ"
            );
        }
    }
);