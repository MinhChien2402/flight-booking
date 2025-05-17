import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async () => {
        const response = await axiosInstance.get('/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (userData) => {
        const response = await axiosInstance.put('/profile', userData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return response.data;
    }
);