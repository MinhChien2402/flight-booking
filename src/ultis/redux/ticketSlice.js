import { createSlice } from "@reduxjs/toolkit";
import {
    searchTickets,
    getListTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    getPlanesByAirline,
} from "../../thunk/ticketThunk";
import { getListAirports } from "../../thunk/airportThunk";
import { getAirlines } from "../../thunk/airlineThunk";
import { getListPlanes } from "../../thunk/planeThunk";

const ticketSlice = createSlice({
    name: "ticket",
    initialState: {
        tickets: [],
        airlines: [], // Thêm state cho airlines
        planes: [],   // Thêm state cho planes
        airports: [], // Thêm state cho airports
        planesByAirline: [], // Thêm state cho planes theo airlineId
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Search Tickets
        builder
            .addCase(searchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(searchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get List Tickets
            .addCase(getListTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(getListTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Ticket
            .addCase(createTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets.push(action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Ticket
            .addCase(updateTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tickets.findIndex(
                    (ticket) => ticket.id === action.payload.id
                );
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Ticket
            .addCase(deleteTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = state.tickets.filter(
                    (ticket) => ticket.id !== action.payload
                );
            })
            .addCase(deleteTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Airlines
            .addCase(getAirlines.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAirlines.fulfilled, (state, action) => {
                state.loading = false;
                state.airlines = action.payload;
            })
            .addCase(getAirlines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.airlines = []; // Đảm bảo airlines không bị undefined
            })
            // Get Planes
            .addCase(getListPlanes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListPlanes.fulfilled, (state, action) => {
                state.loading = false;
                state.planes = action.payload;
            })
            .addCase(getListPlanes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.planes = []; // Đảm bảo planes không bị undefined
            })
            // Get Airports
            .addCase(getListAirports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListAirports.fulfilled, (state, action) => {
                state.loading = false;
                state.airports = action.payload;
            })
            .addCase(getListAirports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.airports = []; // Đảm bảo airports không bị undefined
            })
            // Get Planes By Airline
            .addCase(getPlanesByAirline.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlanesByAirline.fulfilled, (state, action) => {
                state.loading = false;
                state.planesByAirline = action.payload;
            })
            .addCase(getPlanesByAirline.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.planesByAirline = []; // Đảm bảo planesByAirline không bị undefined
            });
    },
});

export default ticketSlice.reducer;