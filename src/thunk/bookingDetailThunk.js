import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getBookingDetail = createAsyncThunk(
    'bookingDetail/getBookingDetail',
    async (bookingId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            console.log("Token:", token);
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
            }
            const response = await axiosInstance.get(`/Booking/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("API Error:", error.message, error.response?.data);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return rejectWithValue("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy chi tiết vé');
        }
    }
);