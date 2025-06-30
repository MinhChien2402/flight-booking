import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const registerUser = createAsyncThunk(
    "authentication/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            // Đảm bảo tất cả các trường từ RegisterRequest được gửi, ngay cả khi null
            const requestData = {
                email: userData.email || null,
                password: userData.password || null,
                fullName: userData.fullName || null,
                role: userData.role || "customer",
                address: userData.address || null,
                phoneNumber: userData.phoneNumber || null,
                PreferredCreditCard: userData.PreferredCreditCard || null,
                sex: userData.sex || null,
                age: userData.age || null,
            };

            if (process.env.NODE_ENV === "development") {
                console.log("Sending register request with data:", JSON.stringify(requestData, null, 2));
            }

            const response = await axiosInstance.post("/Authentication/register", requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (process.env.NODE_ENV === "development") {
                console.log("Registration response:", response.data);
            }

            return response.data;
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.log("Register error response:", error.response?.data);
            }
            return rejectWithValue(
                error.response?.data || error.message || "Registration failed"
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