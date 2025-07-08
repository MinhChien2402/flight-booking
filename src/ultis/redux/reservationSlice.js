import { createSlice } from "@reduxjs/toolkit";
import { getReservationDetail } from "../../thunk/reservationDetailThunk";

const initialState = {
    reservationDetail: null,
    loading: false,
    error: null,
};

const reservationDetailSlice = createSlice({
    name: "reservationDetail",
    initialState,
    reducers: {
        resetReservationDetailState: (state) => {
            state.reservationDetail = null;
            state.loading = false;
            state.error = null;
            console.log("Reservation detail state reset");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReservationDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.reservationDetail = null;
                console.log("Fetching reservation detail, state set to loading");
            })
            .addCase(getReservationDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.reservationDetail = action.payload;
                state.error = null;
                console.log("Reservation detail updated:", action.payload);
            })
            .addCase(getReservationDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.reservationDetail = null;
                console.error("Reservation detail fetch failed:", action.payload);
            });
    },
});

export const { resetReservationDetailState } = reservationDetailSlice.actions;
export default reservationDetailSlice.reducer;