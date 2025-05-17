import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Tìm kiếm vé máy bay
export const searchTickets = createAsyncThunk(
    "ticket/searchTickets",
    async (searchParams, { rejectWithValue }) => {
        try {
            const params = {
                departureAirportId: searchParams.departureAirportId,
                arrivalAirportId: searchParams.arrivalAirportId,
                departureDate: searchParams.departureDate,
            };
            console.log("Calling API with params:", params);
            const response = await axiosInstance.post("/tickets/search", params);

            return response.data;
        } catch (error) {
            console.error("API error:", error);
            return rejectWithValue(error.response?.data || "Lỗi tìm kiếm vé");
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