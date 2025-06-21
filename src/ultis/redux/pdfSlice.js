import { createSlice } from "@reduxjs/toolkit";
import { downloadReservationPdf } from "../../thunk/pdfGenerationThunk"; // Cập nhật đường dẫn

const pdfSlice = createSlice({
    name: "pdf",
    initialState: {
        loading: false,
        error: null,
        success: false,
        reservationId: null,
    },
    reducers: {
        // Reset trạng thái tải PDF
        resetPdfState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.reservationId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(downloadReservationPdf.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(downloadReservationPdf.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.reservationId = action.payload.reservationId;
            })
            .addCase(downloadReservationPdf.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { resetPdfState } = pdfSlice.actions;
export default pdfSlice.reducer;