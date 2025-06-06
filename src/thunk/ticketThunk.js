import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const searchTickets = createAsyncThunk(
    "ticket/searchTickets",
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

            // Gọi API
            const response = await axiosInstance.post("/tickets/search", params);

            // Kiểm tra phản hồi
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
export const getListTickets = createAsyncThunk(
    "ticket/getListTickets",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/tickets");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy chi tiết vé theo ID (Thêm mới)
export const getTicket = createAsyncThunk(
    "ticket/getTicket",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/tickets/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi lấy chi tiết vé");
        }
    }
);

// API mới: Lấy danh sách máy bay theo airlineId
export const getPlanesByAirline = createAsyncThunk(
    "plane/getPlanesByAirline",
    async (airlineId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/tickets/planes/by-airline/${airlineId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Tạo vé mới
export const createTicket = createAsyncThunk(
    "ticket/createTicket",
    async (ticketData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/tickets", ticketData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Cập nhật vé
export const updateTicket = createAsyncThunk(
    "ticket/updateTicket",
    async ({ id, ticketData }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/tickets/${id}`, ticketData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Xóa vé
export const deleteTicket = createAsyncThunk(
    "ticket/deleteTicket",
    async (id, thunkAPI) => {
        try {
            await axiosInstance.delete(`/tickets/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);