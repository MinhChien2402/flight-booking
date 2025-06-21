import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const registerUser = createAsyncThunk(
    "authentication/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/Authentication/register", userData); // Đổi từ /Auth/register
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

// Thunk cho đăng nhập
export const loginUser = createAsyncThunk(
    "authentication/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/Authentication/login", userData); // Đổi từ /Auth/login
            // Lưu token vào localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", response.data.user.role);

            const { password, ...safeUser } = response.data.user;
            localStorage.setItem("currentUser", JSON.stringify(safeUser));
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);