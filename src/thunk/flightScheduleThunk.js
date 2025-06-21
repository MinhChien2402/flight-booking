import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const searchFlightSchedules = createAsyncThunk(
    "flightSchedule/searchFlightSchedules",
    async (searchParams, { rejectWithValue }) => {
        try {
            const params = {
                DepartureAirportId: searchParams.DepartureAirportId || 0,
                ArrivalAirportId: searchParams.ArrivalAirportId || 0,
                DepartureDate: searchParams.DepartureDate || "",
                TripType: searchParams.TripType || "oneWay",
                Adults: searchParams.Adults || 1,
                Children: searchParams.Children || 0,
                FlightClass: searchParams.FlightClass || "Economy",
                ReturnDate: searchParams.ReturnDate || null,
            };

            const response = await axiosInstance.post("/FlightSchedule/search", params);

            if (!response.data) {
                throw new Error("No data returned from API");
            }

            console.log("API response:", response.data);
            return response.data;
        } catch (error) {
            console.error("API error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            return rejectWithValue(
                error.response?.data?.message || error.message || "Lỗi tìm kiếm vé"
            );
        }
    }
);

// Lấy danh sách tất cả vé
export const getListFlightSchedules = createAsyncThunk(
    "flightSchedule/getListFlightSchedules",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/FlightSchedule");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy chi tiết vé theo ID
export const getFlightSchedule = createAsyncThunk(
    "flightSchedule/getFlightSchedule",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/FlightSchedule/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi lấy chi tiết vé");
        }
    }
);

// Lấy danh sách máy bay theo airlineId
export const getAircraftsByAirline = createAsyncThunk(
    "flightSchedule/getAircraftsByAirline",
    async (airlineId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/FlightSchedule/aircrafts/by-airline/${airlineId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Tạo vé mới
export const createFlightSchedule = createAsyncThunk(
    "flightSchedule/createFlightSchedule",
    async (flightScheduleData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/FlightSchedule", flightScheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Cập nhật vé
export const updateFlightSchedule = createAsyncThunk(
    "flightSchedule/updateFlightSchedule",
    async ({ id, flightScheduleData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/FlightSchedule/${id}`, flightScheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Xóa vé
export const deleteFlightSchedule = createAsyncThunk(
    "flightSchedule/deleteFlightSchedule",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/FlightSchedule/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);