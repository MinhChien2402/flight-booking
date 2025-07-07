import { createSlice } from "@reduxjs/toolkit";
import { blockReservation, createReservation, confirmReservation, rescheduleReservation } from "../../thunk/reservationThunk";

const reservationSlice = createSlice({
    name: "reservation",
    initialState: {
        status: "idle",
        error: null,
        currentReservation: null,
        blockedReservation: null,
        confirmedReservation: null,
        rescheduledReservation: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            })
            .addCase(rescheduleReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(rescheduleReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.rescheduledReservation = action.payload;
            })
            .addCase(rescheduleReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to reschedule reservation";
            });
    },
});

export default reservationSlice.reducer;