// Libs
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Thunks
import { getAirlines } from "../thunk/airlineThunk";
import { getListAirports } from "../thunk/airportThunk";
import { getListCountries } from "../thunk/countryThunk";
import { getListFlightSchedules } from "../thunk/flightScheduleThunk";
import { getListAircrafts } from "../thunk/aircraftThunk";
// Others
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    //#region Declare Hook
    const dispatch = useDispatch();
    //#endregion Declare Hook

    //#region Selector
    const { isLoggedIn } = useSelector((state) => state.authentication);
    //#endregion Selector

    //#region Declare State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //#endregion Declare State

    //#region Implement Hook
    useEffect(() => {
        if (isLoggedIn) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const [airlinesData, airportsData, countriesData, flightSchedulesData, aircraftsData] = await Promise.all([
                        dispatch(getAirlines()).unwrap(),
                        dispatch(getListAirports()).unwrap(),
                        dispatch(getListCountries()).unwrap(),
                        dispatch(getListFlightSchedules()).unwrap(),
                        dispatch(getListAircrafts()).unwrap(),
                    ]);
                    console.log("Airlines:", airlinesData);
                    console.log("Airports:", airportsData);
                    console.log("Countries:", countriesData);
                    console.log("Flight Schedules:", flightSchedulesData);
                    console.log("Aircrafts:", aircraftsData);
                } catch (err) {
                    const errorMessage = err?.message ||
                        (err.name === "AxiosError" && err.code === "ERR_CONNECTION_REFUSED"
                            ? "Connection refused. Please ensure the backend server is running on localhost:7018."
                            : err.response?.data?.message || "Failed to fetch data. Please try again later.");
                    setError(errorMessage);
                    toast.error(errorMessage, { autoClose: 5000 }); // Hiển thị thông báo trong 5 giây
                    console.error("Error fetching data:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isLoggedIn, dispatch]);
    //#endregion Implement Hook

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, error }}>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);