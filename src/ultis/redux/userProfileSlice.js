import { createSlice } from "@reduxjs/toolkit";
import { getUserProfile, updateUserProfile } from "../../thunk/userProfileThunk"; // Cập nhật đường dẫn

const userProfileSlice = createSlice({
    name: "userProfile", // Đổi từ user
    initialState: {
        userInfo: {
            fullName: "",
            email: "",
            phoneNumber: "",
            dateOfBirth: "",
            address: "",
            sex: "",
            age: null,
            preferredCreditCard: "",
            skyMiles: 0,
        },
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userInfo = {
                    ...state.userInfo,
                    ...action.payload,
                };
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch user profile";
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userInfo = {
                    ...state.userInfo,
                    ...action.payload,
                };
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to update user profile";
            });
    },
});

export default userProfileSlice.reducer;