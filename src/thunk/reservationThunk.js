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


export const blockReservation = createAsyncThunk(
    "reservation/blockReservation",
    async (reservationData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return rejectWithValue("No authentication token found");

            const response = await axiosInstance.post("/Reservation/block", reservationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to block reservation");
        }
    }
);


export const confirmReservation = createAsyncThunk(
    "reservation/confirmReservation",
    async (reservationId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return rejectWithValue("No authentication token found");

            const response = await axiosInstance.post(`/Reservation/confirm/${reservationId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to confirm reservation");
        }
    }
);