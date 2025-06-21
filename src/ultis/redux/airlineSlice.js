import { createSlice } from "@reduxjs/toolkit";
import { getAirlines, createAirline, deleteAirline, updateAirline } from "../../thunk/airlineThunk";

const initialState = {
    list: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    updateLoading: false,
    updateError: null,
    deleteLoading: false, // Thêm trạng thái loading cho delete
    deleteError: null,   // Thêm trạng thái error cho delete
};

const airlineSlice = createSlice({
    name: "airline",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Airlines actions
            .addCase(getAirlines.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAirlines.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAirlines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Airline actions
            .addCase(createAirline.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createAirline.fulfilled, (state, action) => {
                state.createLoading = false;
                state.list.push(action.payload);
            })
            .addCase(createAirline.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })
            // Delete Airline actions
            .addCase(deleteAirline.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteAirline.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.list = state.list.filter((airline) => airline.id !== action.payload);
            })
            .addCase(deleteAirline.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })
            // Update Airline actions
            .addCase(updateAirline.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateAirline.fulfilled, (state, action) => {
                state.updateLoading = false;
                const index = state.list.findIndex((airline) => airline.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload; // Cập nhật airline trong danh sách
                }
            })
            .addCase(updateAirline.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            });
    },
});

export default airlineSlice.reducer;