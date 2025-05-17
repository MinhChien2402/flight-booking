import { createSlice } from "@reduxjs/toolkit";
import { createBooking } from "../../thunk/bookingThunk";

const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        status: 'idle',
        error: null,
        currentBooking: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentBooking = action.payload;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default bookingSlice.reducer;