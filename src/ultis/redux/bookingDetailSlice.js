import { createSlice } from "@reduxjs/toolkit";
import { getBookingDetail } from "../../thunk/bookingDetailThunk";

const bookingDetailSlice = createSlice({
    name: 'bookingDetail',
    initialState: {
        bookingDetail: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Reset trạng thái chi tiết vé
        resetBookingDetailState: (state) => {
            state.bookingDetail = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBookingDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookingDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingDetail = action.payload;
            })
            .addCase(getBookingDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBookingDetailState } = bookingDetailSlice.actions;
export default bookingDetailSlice.reducer;