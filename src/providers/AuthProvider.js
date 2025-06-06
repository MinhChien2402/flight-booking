import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAirlines } from "../thunk/airlineThunk";
import { getListAirports } from "../thunk/airportThunk";
import { getListCountries } from "../thunk/countryThunk";
import { getListTickets } from "../thunk/ticketThunk";
import { getListPlanes } from "../thunk/planeThunk";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getAirlines())
                .unwrap()
                .then((data) => console.log("Airlines:", data))
                .catch((error) => console.error("Error fetching airlines:", error));

            dispatch(getListAirports())
                .unwrap()
                .then((data) => console.log("Airports:", data))
                .catch((error) => console.error("Error fetching airports:", error));

            dispatch(getListCountries())
                .unwrap()
                .then((data) => console.log("Countries:", data))
                .catch((error) => console.error("Error fetching countries:", error));

            dispatch(getListTickets())
                .unwrap()
                .then((data) => console.log("Tickets:", data))
                .catch((error) => console.error("Error fetching tickets:", error));

            dispatch(getListPlanes())
                .unwrap()
                .then((data) => console.log("Planes:", data))
                .catch((error) => console.error("Error fetching planes:", error));
        }
    }, [isLoggedIn, dispatch]);

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);