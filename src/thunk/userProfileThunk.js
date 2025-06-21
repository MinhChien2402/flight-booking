import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getUserProfile = createAsyncThunk(
    "userProfile/getUserProfile", // Đổi từ user/getUserProfile
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No authentication token found");
            }

            const response = await axiosInstance.get("/UserProfile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user profile"
            );
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUserProfile", // Đổi từ user/updateUserProfile
    async (userData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No authentication token found");
            }

            const response = await axiosInstance.put("/UserProfile", userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update user profile"
            );
        }
    }
);