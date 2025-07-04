import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getUserReservations = createAsyncThunk(
    "userReservation/getUserReservations",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) return rejectWithValue("Không tìm thấy token. Vui lòng đăng nhập lại.");
        try {
            const response = await axiosInstance.get("/Reservation/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache", // Thêm để bỏ cache
                },
            });
            console.log("API Response:", response.data, "Status:", response.status);
            if (!Array.isArray(response.data)) {
                console.warn("Response data is not an array:", response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message, error.response?.status);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return rejectWithValue("Phiên đăng nhập hết hạn.");
            }
            return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy danh sách đặt chỗ");
        }
    }
);