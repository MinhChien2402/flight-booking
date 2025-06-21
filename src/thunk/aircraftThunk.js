import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListAircrafts = createAsyncThunk(
    "aircraft/getListAircrafts", // Đổi từ getListPlanes
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Aircraft");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createAircraft = createAsyncThunk(
    "aircraft/createAircraft", // Đổi từ createPlane
    async (aircraftData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/Aircraft", {
                Name: aircraftData.name.trim(),
                Code: aircraftData.code.trim().toUpperCase(),
                AdditionalCode: aircraftData.additionalCode
                    ? aircraftData.additionalCode.trim().toUpperCase()
                    : null,
                AirlineAircrafts: [], // Đảm bảo khớp với model Aircraft
            });
            return response.data;
        } catch (error) {
            console.error("Create Aircraft Error:", error.response?.data);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateAircraft = createAsyncThunk(
    "aircraft/updateAircraft", // Đổi từ updatePlane
    async ({ id, aircraftData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/Aircraft/${id}`, {
                Id: id,
                Name: aircraftData.name.trim(),
                Code: aircraftData.code.trim().toUpperCase(),
                AdditionalCode: aircraftData.additionalCode
                    ? aircraftData.additionalCode.trim().toUpperCase()
                    : null,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteAircraft = createAsyncThunk(
    "aircraft/deleteAircraft", // Đổi từ deletePlane
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/Aircraft/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);