import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListAirports = createAsyncThunk(
    "airports/getList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/airports");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk để tạo sân bay mới
export const createAirport = createAsyncThunk(
    "airports/create",
    async (airportData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/airports", airportData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk để cập nhật sân bay
export const updateAirport = createAsyncThunk(
    "airports/update",
    async ({ id, airportData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/airports/${id}`, airportData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Thunk để xóa sân bay
export const deleteAirport = createAsyncThunk(
    "airports/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/airports/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);