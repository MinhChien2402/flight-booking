import { createSlice } from "@reduxjs/toolkit";
import { createAirport, deleteAirport, getListAirports, updateAirport } from "../../thunk/airportThunk";

const airportSlice = createSlice({
    name: "airports",
    initialState: {
        data: [], // Danh sách sân bay
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get List Airports
        builder
            .addCase(getListAirports.pending, (state) => {
                state.loading = true;
                state.error = null;
                if (process.env.NODE_ENV === "development") {
                    console.log("getListAirports pending");
                }
            })
            .addCase(getListAirports.fulfilled, (state, action) => {
                state.loading = false;
                state.data = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
                if (process.env.NODE_ENV === "development") {
                    console.log("getListAirports fulfilled, data:", state.data);
                }
            })
            .addCase(getListAirports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch airports";
                state.data = [];
                if (process.env.NODE_ENV === "development") {
                    console.log("getListAirports rejected, error:", state.error);
                }
            });

        // Create Airport
        builder
            .addCase(createAirport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAirport.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(action.payload);
            })
            .addCase(createAirport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Airport
        builder
            .addCase(updateAirport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAirport.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex(
                    (airport) => airport.id === action.payload.id
                );
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(updateAirport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Airport
        builder
            .addCase(deleteAirport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAirport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter(
                    (airport) => airport.id !== action.payload
                );
            })
            .addCase(deleteAirport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = airportSlice.actions;
export default airportSlice.reducer;