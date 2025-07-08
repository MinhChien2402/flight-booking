import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getReservationDetail = createAsyncThunk(
    "reservationDetail/getReservationDetail",
    async (reservationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            console.log("Fetching reservation detail with token:", token);
            if (!token) {
                console.error("No token found in localStorage");
                return rejectWithValue("Token không tồn tại. Vui lòng đăng nhập lại.");
            }

            const response = await axiosInstance.get(`/Reservation/${reservationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("API Response for reservationId:", reservationId, response.data);
            if (!response.data || Object.keys(response.data).length === 0) {
                console.warn("Empty or invalid API response for reservationId:", reservationId);
                return rejectWithValue("Không tìm thấy thông tin đặt chỗ hoặc dữ liệu không hợp lệ.");
            }

            return response.data;
        } catch (error) {
            console.error("API Error for reservationId:", reservationId, error.message, error.response?.data);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return rejectWithValue("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi lấy chi tiết đặt chỗ"
            );
        }
    }
);