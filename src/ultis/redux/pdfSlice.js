import { createSlice } from "@reduxjs/toolkit";
import { downloadBookingPdf } from "../../thunk/pdfThunk";

const pdfSlice = createSlice({
    name: 'pdf',
    initialState: {
        loading: false,
        error: null,
        success: false,
        bookingId: null,
    },
    reducers: {
        // Reset trạng thái tải PDF
        resetPdfState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.bookingId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(downloadBookingPdf.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(downloadBookingPdf.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.bookingId = action.payload.bookingId;
            })
            .addCase(downloadBookingPdf.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetPdfState } = pdfSlice.actions;
export default pdfSlice.reducer;