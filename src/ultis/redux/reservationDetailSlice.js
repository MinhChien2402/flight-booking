// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { getReservationDetail } from "../../thunk/reservationDetailThunk";

// Styles, images, icons

const reservationDetailSlice = createSlice({
    //#region Slice Configuration
    name: "reservationDetail",
    initialState: {
        reservationDetail: null,
        loading: false,
        error: null,
    },
    //#endregion Slice Configuration

    //#region Reducers
    reducers: {
        resetReservationDetailState: (state) => {
            state.reservationDetail = null;
            state.loading = false;
            state.error = null;
        },
    },
    //#endregion Reducers

    //#region Extra Reducers
    extraReducers: (builder) => {
        builder
            .addCase(getReservationDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReservationDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.reservationDetail = action.payload;
            })
            .addCase(getReservationDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
    //#endregion Extra Reducers
});

export const { resetReservationDetailState } = reservationDetailSlice.actions;
export default reservationDetailSlice.reducer;