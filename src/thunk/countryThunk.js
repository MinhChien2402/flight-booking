import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListCountries = createAsyncThunk(
    "country/getListCountries",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/Country"); // Đổi từ /countries
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Unknown error"
            );
        }
    }
);

export const createCountry = createAsyncThunk(
    "country/createCountry",
    async (countryData, { rejectWithValue }) => {
        try {
            console.log("Dữ liệu gửi đi trong createCountry:", countryData);
            const response = await axiosInstance.post("/Country", countryData); // Đổi từ /countries
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to create country"
            );
        }
    }
);

export const updateCountry = createAsyncThunk(
    "country/updateCountry",
    async ({ id, countryData }, { rejectWithValue }) => {
        try {
            console.log("Dữ liệu gửi đi trong updateCountry:", {
                url: `/Country/${id}`,
                data: countryData,
            });
            const response = await axiosInstance.put(`/Country/${id}`, countryData); // Đổi từ /countries
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to update country"
            );
        }
    }
);

export const deleteCountry = createAsyncThunk(
    "country/deleteCountry",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/Country/${id}`); // Đổi từ /countries
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to delete country"
            );
        }
    }
);