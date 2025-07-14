import { createSlice } from "@reduxjs/toolkit";
import { blockReservation, cancelReservation, confirmReservation, createReservation, getAllReservations, getCancelRules, rescheduleReservation } from "../../thunk/reservationThunk";

const initialState = {
    allReservations: [],
    currentReservation: null,
    status: "idle",
    error: null,
    cancelRules: null,
    cancelSuccess: false,
};

const reservationSlice = createSlice({
    name: "reservation",
    initialState,
    reducers: {
        resetReservationState: (state) => {
            state.allReservations = [];
            state.currentReservation = null;
            state.status = "idle";
            state.error = null;
            state.cancelRules = null;
            state.cancelSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Reservations 
            .addCase(getAllReservations.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllReservations.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allReservations = action.payload;
                state.error = null;
            })
            .addCase(getAllReservations.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Create Reservation
            .addCase(createReservation.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentReservation = action.payload;
                state.error = null;
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Block Reservation
            .addCase(blockReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(blockReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentReservation = action.payload;
            })
            .addCase(blockReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Confirm Reservation
            .addCase(confirmReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(confirmReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentReservation = action.payload;
            })
            .addCase(confirmReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Reschedule Reservation
            .addCase(rescheduleReservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(rescheduleReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentReservation = action.payload;
            })
            .addCase(rescheduleReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Cancel Reservation
            .addCase(cancelReservation.pending, (state) => {
                state.status = "loading";
                state.cancelSuccess = false;
                state.error = null;
            })
            .addCase(cancelReservation.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cancelSuccess = true;
                state.currentReservation = null; // Reset nếu cần
                state.cancelRules = null;
            })
            .addCase(cancelReservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
                state.cancelSuccess = false;
            })

            // Get Cancel Rules
            .addCase(getCancelRules.pending, (state) => {
                state.status = "loading";
                state.cancelRules = null;
                state.error = null;
            })
            .addCase(getCancelRules.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cancelRules = action.payload;
            })
            .addCase(getCancelRules.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { resetReservationState } = reservationSlice.actions;
export default reservationSlice.reducer;