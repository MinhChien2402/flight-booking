import { createSlice } from "@reduxjs/toolkit";
import { getUserBookings } from "../../thunk/userBookingThunk";

const userBookingSlice = createSlice({
    name: 'userBooking',
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Reset trạng thái booking
        resetUserBookingState: (state) => {
            state.bookings = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(getUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetUserBookingState } = userBookingSlice.actions;
export default userBookingSlice.reducer;