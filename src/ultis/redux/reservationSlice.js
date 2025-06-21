import { createSlice } from "@reduxjs/toolkit";
import { createReservation } from "../../thunk/reservationThunk"
const reservationSlice = createSlice({
    name: "reservation",
    initialState: {
        status: "idle",
        error: null,
        currentReservation: null,
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
            });
    },
});

export default reservationSlice.reducer;