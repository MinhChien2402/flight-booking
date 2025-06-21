import { createSlice } from "@reduxjs/toolkit";
import { getUserReservations } from "../../thunk/userReservationThunk"; // Cập nhật đường dẫn

const userReservationSlice = createSlice({
    name: "userReservation", // Đổi từ userBooking
    initialState: {
        reservations: [], // Đổi từ bookings
        loading: false,
        error: null,
    },
    reducers: {
        // Reset trạng thái đặt chỗ
        resetUserReservationState: (state) => {
            state.reservations = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = action.payload;
            })
            .addCase(getUserReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetUserReservationState } = userReservationSlice.actions; // Đổi từ resetUserBookingState
export default userReservationSlice.reducer;