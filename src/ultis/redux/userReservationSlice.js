// Libs
import { createSlice } from "@reduxjs/toolkit";
import { getUserReservations } from "../../thunk/userReservationThunk";

const userReservationSlice = createSlice({
    name: "userReservation",
    initialState: {
        reservations: [],
        loading: false,
        error: null,
    },
    reducers: {
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
                state.reservations = action.payload || [];
                console.log("Reservations updated:", state.reservations);
            })
            .addCase(getUserReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Reservations error:", action.payload);
            });
    },
});

export const { resetUserReservationState } = userReservationSlice.actions;
export default userReservationSlice.reducer;