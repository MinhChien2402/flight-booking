import { createSlice } from "@reduxjs/toolkit";
import { getListPlanes, createPlane, updatePlane, deletePlane } from "../../thunk/planeThunk";

const planeSlice = createSlice({
    name: "plane",
    initialState: {
        planes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Get List Planes
        builder
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
            })
            // Create Plane
            .addCase(createPlane.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlane.fulfilled, (state, action) => {
                state.loading = false;
                state.planes.push(action.payload);
            })
            .addCase(createPlane.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Plane
            .addCase(updatePlane.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlane.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.planes.findIndex((plane) => plane.id === action.payload.id);
                if (index !== -1) {
                    state.planes[index] = action.payload;
                }
            })
            .addCase(updatePlane.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Plane
            .addCase(deletePlane.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePlane.fulfilled, (state, action) => {
                state.loading = false;
                state.planes = state.planes.filter((plane) => plane.id !== action.payload);
            })
            .addCase(deletePlane.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default planeSlice.reducer;