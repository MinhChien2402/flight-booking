import { createSlice } from "@reduxjs/toolkit";
import { getListAirports } from "../../thunk/airportThunk";
import { getAirlines } from "../../thunk/airlineThunk";
import { getListAircrafts } from "../../thunk/aircraftThunk";
import { createFlightSchedule, deleteFlightSchedule, getAircraftsByAirline, getFlightSchedule, getListFlightSchedules, searchFlightSchedules, updateFlightSchedule } from "../../thunk/flightScheduleThunk";

const flightScheduleSlice = createSlice({
    name: "flightSchedule",
    initialState: {
        flightSchedules: [],
        outboundTickets: [],
        returnTickets: [],
        airlines: [],
        aircrafts: [], // Thay planes thành aircrafts
        airports: [],
        aircraftsByAirline: [], // Thay planesByAirline thành aircraftsByAirline
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchFlightSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log("Search flight schedules pending...");
            })
            .addCase(searchFlightSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.outboundTickets = action.payload.OutboundTickets || action.payload.outboundTickets || [];
                state.returnTickets = action.payload.ReturnTickets || action.payload.returnTickets || [];
                state.error = null;
                console.log("Updated outboundTickets:", state.outboundTickets);
                console.log("Updated returnTickets:", state.returnTickets);
            })
            .addCase(searchFlightSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi không xác định";
                state.outboundTickets = [];
                state.returnTickets = [];
                console.log("Search flight schedules rejected - Error:", state.error);
            })
            .addCase(getListFlightSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListFlightSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.flightSchedules = action.payload || [];
            })
            .addCase(getListFlightSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.flightSchedules = [];
            })
            .addCase(createFlightSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFlightSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.flightSchedules.push(action.payload);
            })
            .addCase(createFlightSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateFlightSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFlightSchedule.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.flightSchedules.findIndex(
                    (fs) => fs.id === action.payload.id
                );
                if (index !== -1) {
                    state.flightSchedules[index] = action.payload;
                }
            })
            .addCase(updateFlightSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteFlightSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFlightSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.flightSchedules = state.flightSchedules.filter(
                    (fs) => fs.id !== action.payload
                );
            })
            .addCase(deleteFlightSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAirlines.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAirlines.fulfilled, (state, action) => {
                state.loading = false;
                state.airlines = action.payload || [];
            })
            .addCase(getAirlines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.airlines = [];
            })
            .addCase(getListAircrafts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListAircrafts.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts = action.payload || [];
            })
            .addCase(getListAircrafts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.aircrafts = [];
            })
            .addCase(getListAirports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListAirports.fulfilled, (state, action) => {
                state.loading = false;
                state.airports = action.payload || [];
            })
            .addCase(getListAirports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.airports = [];
            })
            .addCase(getAircraftsByAirline.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAircraftsByAirline.fulfilled, (state, action) => {
                state.loading = false;
                state.aircraftsByAirline = action.payload || [];
            })
            .addCase(getAircraftsByAirline.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.aircraftsByAirline = [];
            })
            .addCase(getFlightSchedule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFlightSchedule.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.flightSchedules.findIndex(
                    (fs) => fs.id === action.payload.id
                );
                if (index !== -1) {
                    state.flightSchedules[index] = action.payload;
                } else {
                    state.flightSchedules.push(action.payload);
                }
            })
            .addCase(getFlightSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default flightScheduleSlice.reducer;