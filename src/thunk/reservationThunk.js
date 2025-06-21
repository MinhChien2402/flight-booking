import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const createReservation = createAsyncThunk(
    "reservation/createReservation",
    async (reservationData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No authentication token found");
            }

            const response = await axiosInstance.post("/Reservation", reservationData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Lỗi tạo đặt chỗ"
            );
        }
    }
);