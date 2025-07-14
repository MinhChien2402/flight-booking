import { createSlice } from "@reduxjs/toolkit";
import { getReservationDetail } from "../../thunk/reservationDetailThunk";
import { cancelReservation, getCancelRules } from "../../thunk/reservationThunk";

const initialState = {
    reservationDetail: null,
    loading: false,
    error: null,
    cancelRules: null,
    cancelLoading: false,
    cancelError: null,
    cancelSuccess: false,
};

const reservationDetailSlice = createSlice({
    name: "reservationDetail",
    initialState,
    reducers: {
        resetReservationDetailState: (state) => {
            state.reservationDetail = null;
            state.loading = false;
            state.error = null;
            state.cancelRules = null;
            state.cancelLoading = false;
            state.cancelError = null;
            state.cancelSuccess = false;
            console.log("Reservation detail and cancel state reset");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReservationDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.reservationDetail = null;
            })
            .addCase(getReservationDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.reservationDetail = action.payload;
                state.error = null;
            })
            .addCase(getReservationDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.reservationDetail = null;
            })
            .addCase(getCancelRules.pending, (state) => {
                state.cancelLoading = true;
                state.cancelError = null;
                state.cancelSuccess = false;
                console.log("Fetching cancellation rules, state set to loading");
            })
            .addCase(getCancelRules.fulfilled, (state, action) => {
                state.cancelLoading = false;
                state.cancelRules = action.payload; // Gán trực tiếp payload
                state.cancelError = null;
                console.log("Cancellation rules updated - Payload:", JSON.stringify(action.payload));
                console.log("Cancellation rules updated - State:", JSON.stringify(state.cancelRules));
            })
            .addCase(getCancelRules.rejected, (state, action) => {
                state.cancelLoading = false;
                state.cancelError = action.payload;
                state.cancelSuccess = false;
                console.error("Cancellation rules fetch failed:", action.payload);
            })
            .addCase(cancelReservation.pending, (state) => {
                state.cancelLoading = true;
                state.cancelError = null;
                state.cancelSuccess = false;
            })
            .addCase(cancelReservation.fulfilled, (state, action) => {
                state.cancelLoading = false;
                state.cancelSuccess = true;
                state.cancelRules = null;
                state.reservationDetail = null;
            })
            .addCase(cancelReservation.rejected, (state, action) => {
                state.cancelLoading = false;
                state.cancelError = action.payload;
                state.cancelSuccess = false;
            });
    },
});

export const { resetReservationDetailState } = reservationDetailSlice.actions;
export default reservationDetailSlice.reducer;