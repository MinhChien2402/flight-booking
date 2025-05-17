import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData) => {
        const response = await axiosInstance.post('/booking', bookingData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    }
);