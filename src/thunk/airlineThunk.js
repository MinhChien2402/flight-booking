import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getAirlines = createAsyncThunk(
    "airline/getAirlines",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Airline"); // Đổi từ /Airlines
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || error.message || "Unknown error"
            );
        }
    }
);

export const createAirline = createAsyncThunk(
    "airline/createAirline",
    async (airlineData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/Airline", airlineData); // Đổi từ /Airlines
            return response.data;
        } catch (error) {
            console.error("Create Airline Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to create airline"
            );
        }
    }
);

export const deleteAirline = createAsyncThunk(
    "airline/deleteAirline",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/Airline/${id}`); // Đổi từ /Airlines
            return id;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || error.message || "Unknown error"
            );
        }
    }
);

export const updateAirline = createAsyncThunk(
    "airline/updateAirline",
    async (airline, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/Airline/${airline.id}`, airline); // Đổi từ /Airlines
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update airline"
            );
        }
    }
);