import { configureStore } from '@reduxjs/toolkit';
import airlineReducer from '../redux/airlineSlice';
import airportReducer from '../redux/airportSlice';
import countryReducer from '../redux/countrySlice';
import aircraftReducer from '../redux/aircraftSlice';
import flightScheduleReducer from '../redux/flightScheduleSlice';
import authenticationReducer from '../redux/authenticationSlice';
import userProfileReducer from '../redux/userProfileSlice';
import reservationReducer from '../redux/reservationSlice';
import userReservationReducer from '../redux/userReservationSlice';
import reservationDetailReducer from '../redux/reservationDetailSlice';
import pdfReducer from '../redux/pdfSlice';


export const store = configureStore({
    reducer: {
        airline: airlineReducer,
        airport: airportReducer,
        country: countryReducer,
        aircraft: aircraftReducer,
        flightSchedule: flightScheduleReducer,
        authentication: authenticationReducer,
        userProfile: userProfileReducer,
        reservation: reservationReducer,
        userReservation: userReservationReducer,
        reservationDetail: reservationDetailReducer,
        pdf: pdfReducer,
    },
});
