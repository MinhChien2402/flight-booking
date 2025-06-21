// Libs
import { createAsyncThunk } from "@reduxjs/toolkit";
// Others
import axiosInstance from "../api/axiosInstance";

// Styles, images, icons

export const getReservationDetail = createAsyncThunk(
    "reservationDetail/getReservationDetail",
    async (reservationId, { rejectWithValue }) => {
        //#region Declare Variables
        //#endregion Declare Variables

        //#region Implement Logic
        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
            }

            const response = await axiosInstance.get(`/Reservation/${reservationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.message, error.response?.data);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return rejectWithValue("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi lấy chi tiết đặt chỗ"
            );
        }
        //#endregion Implement Logic
    }
);