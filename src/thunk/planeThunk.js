import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListPlanes = createAsyncThunk(
    "plane/getListPlanes",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/planes");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createPlane = createAsyncThunk(
    "plane/createPlane",
    async (planeData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/planes", {
                Name: planeData.name.trim(),
                Code: planeData.code.trim().toUpperCase(),
                AdditionalCode: planeData.additionalCode
                    ? planeData.additionalCode.trim().toUpperCase()
                    : null,
                AirlinePlanes: [],
            });
            return response.data;
        } catch (error) {
            console.error("Create Plane Error:", error.response?.data);
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updatePlane = createAsyncThunk(
    "plane/updatePlane",
    async ({ id, planeData }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/planes/${id}`, {
                Id: id,
                Name: planeData.name.trim(),
                Code: planeData.code.trim().toUpperCase(),
                AdditionalCode: planeData.additionalCode
                    ? planeData.additionalCode.trim().toUpperCase()
                    : null,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deletePlane = createAsyncThunk(
    "plane/deletePlane",
    async (id, thunkAPI) => {
        try {
            await axiosInstance.delete(`/planes/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);