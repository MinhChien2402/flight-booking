import { createSlice } from "@reduxjs/toolkit";
import { blockReservation, createReservation, confirmReservation } from "../../thunk/reservationThunk";

const reservationSlice = createSlice({
    name: "reservation",
    initialState: {
        status: "idle",
        error: null,
        currentReservation: null,
        blockedReservation: null,
        confirmedReservation: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Xử lý createReservation
            .addCase(createReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentReservation = action.payload;
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to create reservation";
            })
            // Xử lý blockReservation
            .addCase(blockReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(blockReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.blockedReservation = action.payload;
            })
            .addCase(blockReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Xử lý confirmReservation
            .addCase(confirmReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(confirmReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.confirmedReservation = action.payload;
            })
            .addCase(confirmReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to confirm reservation";
            });
    },
});

export default reservationSlice.reducer;