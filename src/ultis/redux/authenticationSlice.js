import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../thunk/authenticationThunk";

const authSlice = createSlice({
    name: "authentication",
    initialState: {
        user: JSON.parse(localStorage.getItem("currentUser")) || null,
        isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
        role: localStorage.getItem("role") || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.role = null;
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            localStorage.removeItem("currentUser");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                // Không cập nhật user trực tiếp từ register, chờ login
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user; // Đảm bảo user chứa đầy đủ thông tin
                state.isLoggedIn = true;
                state.role = action.payload.user.role;
                // Lưu userInfo vào localStorage
                const { password, ...safeUser } = action.payload.user;
                localStorage.setItem("currentUser", JSON.stringify(safeUser));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;