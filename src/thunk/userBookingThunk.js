import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getUserBookings = createAsyncThunk(
    'booking/getUserBookings',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        console.log("Token:", token);
        if (!token) {
            return rejectWithValue("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        try {
            const response = await axiosInstance.get('/Booking/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API Response Data:", response.data);
            return response.data;
        } catch (error) {
            console.log("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách booking');
        }
    }
);