import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const getAirlines = createAsyncThunk(
    'airline/getAirlines',
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/Airlines');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || 'Unknown error'
            );
        }
    }
);

export const createAirline = createAsyncThunk(
    'airline/createAirline',
    async (airlineData, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/Airlines', airlineData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


export const deleteAirline = createAsyncThunk(
    'airline/deleteAirline',
    async (id, thunkAPI) => {
        try {
            await axiosInstance.delete(`/Airlines/${id}`);
            return id; // Trả về id để dễ dàng xóa trong state
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || 'Unknown error'
            );
        }
    }
);

export const updateAirline = createAsyncThunk(
    'airline/updateAirline',
    async (airline, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/Airlines/${airline.id}`, airline); // đúng swagger
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);