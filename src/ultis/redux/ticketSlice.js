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
        outboundTickets: [],
        returnTickets: [],
        airlines: [],
        planes: [],
        airports: [],
        planesByAirline: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log("Search tickets pending...");
            })
            .addCase(searchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.outboundTickets = action.payload.OutboundTickets || action.payload.outboundTickets || [];
                state.returnTickets = action.payload.ReturnTickets || action.payload.returnTickets || [];
                state.error = null;
                console.log("Updated outboundTickets:", state.outboundTickets);
                console.log("Updated returnTickets:", state.returnTickets);
            })
            .addCase(searchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi không xác định";
                state.outboundTickets = [];
                state.returnTickets = [];
                console.log("Search tickets rejected - Error:", state.error);
            })
            .addCase(getListTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload || [];
            })
            .addCase(getListTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.tickets = [];
            })
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
            .addCase(getListPlanes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getListPlanes.fulfilled, (state, action) => {
                state.loading = false;
                state.planes = action.payload || [];
            })
            .addCase(getListPlanes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.planes = [];
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
            .addCase(getPlanesByAirline.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlanesByAirline.fulfilled, (state, action) => {
                state.loading = false;
                state.planesByAirline = action.payload || [];
            })
            .addCase(getPlanesByAirline.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.planesByAirline = [];
            });
    },
});

export default ticketSlice.reducer;