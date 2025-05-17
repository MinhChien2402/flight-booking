import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const getListCountries = createAsyncThunk(
    "country/getListCountries",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/countries");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createCountry = createAsyncThunk(
    "country/createCountry",
    async (countryData, thunkAPI) => {
        try {
            console.log("Dữ liệu gửi đi trong createCountry:", countryData);
            const response = await axiosInstance.post("/countries", countryData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCountry = createAsyncThunk(
    "country/updateCountry",
    async ({ id, countryData }, thunkAPI) => {
        try {
            console.log("Dữ liệu gửi đi trong updateCountry:", { url: `/countries/${id}`, data: countryData });
            const response = await axiosInstance.put(`/countries/${id}`, countryData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCountry = createAsyncThunk(
    "country/deleteCountry",
    async (id, thunkAPI) => {
        try {
            await axiosInstance.delete(`/countries/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);