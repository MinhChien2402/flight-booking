import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListAirports = createAsyncThunk(
    "airports/getList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Airport"); // Đổi từ /airports
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Unknown error"
            );
        }
    }
);

// Thunk để tạo sân bay mới
export const createAirport = createAsyncThunk(
    "airports/create",
    async (airportData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/Airport", airportData); // Đổi từ /airports
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to create airport"
            );
        }
    }
);

// Thunk để cập nhật sân bay
export const updateAirport = createAsyncThunk(
    "airports/update",
    async ({ id, airportData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/Airport/${id}`, airportData); // Đổi từ /airports
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update airport"
            );
        }
    }
);

// Thunk để xóa sân bay
export const deleteAirport = createAsyncThunk(
    "airports/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/Airport/${id}`); // Đổi từ /airports
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to delete airport"
            );
        }
    }
);