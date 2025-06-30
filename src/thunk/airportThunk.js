import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListAirports = createAsyncThunk(
    "airports/getList",
    async (_, { rejectWithValue }) => {
        try {
            if (process.env.NODE_ENV === "development") {
                console.log("Calling getListAirports...");
            }
            const response = await axiosInstance.get("/Airport");
            if (process.env.NODE_ENV === "development") {
                console.log("getListAirports response:", response.data);
            }
            // Kiểm tra nếu response.data là object và có message, coi như lỗi
            if (response.data && typeof response.data === "object" && "message" in response.data) {
                return rejectWithValue(response.data.message);
            }
            // Đảm bảo trả về mảng, nếu không phải mảng thì trả về mảng rỗng
            return Array.isArray(response.data) ? response.data : [];
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
            const response = await axiosInstance.post("/Airport", airportData);
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
            const response = await axiosInstance.put(`/Airport/${id}`, airportData);
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
            await axiosInstance.delete(`/Airport/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to delete airport"
            );
        }
    }
);