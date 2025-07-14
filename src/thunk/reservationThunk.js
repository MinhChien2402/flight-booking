import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getAllReservations = createAsyncThunk(
    "reservation/getAllReservations",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/Reservation/all", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

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

export const rescheduleReservation = createAsyncThunk(
    "reservation/rescheduleReservation",
    async ({ reservationId, newFlightScheduleId }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return rejectWithValue("No authentication token found");

            const response = await axiosInstance.put(`/Reservation/reschedule/${reservationId}`, { NewFlightScheduleId: newFlightScheduleId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to reschedule reservation");
        }
    }
);

export const cancelReservation = createAsyncThunk(
    "reservation/cancelReservation",
    async (reservationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/Reservation/cancel/${reservationId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to cancel reservation" }
            );
        }
    }
);

export const getCancelRules = createAsyncThunk(
    "reservation/getCancelRules",
    async (reservationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/Reservation/cancel-rules/${reservationId}`);
            console.log("getCancelRules API response:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch cancellation rules" }
            );
        }
    }
);