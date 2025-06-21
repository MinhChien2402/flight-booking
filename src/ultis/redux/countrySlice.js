import { createSlice } from "@reduxjs/toolkit";
import { getListCountries, createCountry, updateCountry, deleteCountry } from "../../thunk/countryThunk";

const countrySlice = createSlice({
    name: "country",
    initialState: {
        countries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get List Countries
            .addCase(getListCountries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListCountries.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = action.payload;
            })
            .addCase(getListCountries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Country
            .addCase(createCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries.push(action.payload);
            })
            .addCase(createCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Country
            .addCase(updateCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCountry.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.countries.findIndex(
                    (country) => country.id === action.payload.id
                );
                if (index !== -1) {
                    state.countries[index] = action.payload;
                }
            })
            .addCase(updateCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Country
            .addCase(deleteCountry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCountry.fulfilled, (state, action) => {
                state.loading = false;
                state.countries = state.countries.filter(
                    (country) => country.id !== action.payload
                );
            })
            .addCase(deleteCountry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default countrySlice.reducer;