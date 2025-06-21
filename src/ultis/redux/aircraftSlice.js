import { createSlice } from "@reduxjs/toolkit";
import { getListAircrafts, createAircraft, updateAircraft, deleteAircraft } from "../../thunk/aircraftThunk"; // Cập nhật đường dẫn

const aircraftSlice = createSlice({
    name: "aircraft",
    initialState: {
        aircrafts: [], // Đổi planes thành aircrafts
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Get List Aircrafts
        builder
            .addCase(getListAircrafts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListAircrafts.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts = action.payload;
            })
            .addCase(getListAircrafts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Aircraft
            .addCase(createAircraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAircraft.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts.push(action.payload);
            })
            .addCase(createAircraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Aircraft
            .addCase(updateAircraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAircraft.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.aircrafts.findIndex((aircraft) => aircraft.id === action.payload.id);
                if (index !== -1) {
                    state.aircrafts[index] = action.payload;
                }
            })
            .addCase(updateAircraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Aircraft
            .addCase(deleteAircraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAircraft.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts = state.aircrafts.filter((aircraft) => aircraft.id !== action.payload);
            })
            .addCase(deleteAircraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default aircraftSlice.reducer;