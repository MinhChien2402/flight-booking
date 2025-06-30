import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getAirlines = createAsyncThunk(
    "airline/getAirlines",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Airline");
            if (process.env.NODE_ENV === "development") {
                console.log("getAirlines response:", response.data);
            }
            // Kiểm tra nếu response.data là object và không phải mảng
            if (
                response.data &&
                typeof response.data === "object" &&
                !Array.isArray(response.data)
            ) {
                return rejectWithValue(
                    response.data.message || response.data.error || "Invalid data from API"
                );
            }
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Get Airlines Error:", error.response?.data);
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
            const response = await axiosInstance.post("/Airline", airlineData);
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
            await axiosInstance.delete(`/Airline/${id}`);
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
            const response = await axiosInstance.put(`/Airline/${airline.id}`, airline);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update airline"
            );
        }
    }
);