import { configureStore } from '@reduxjs/toolkit';
import airlineReducer from '../redux/airlineSlice';
import airportReducer from '../redux/airportSlice';
import countryReducer from '../redux/countrySlice';
import planeReducer from '../redux/planeSlice';
import ticketReducer from '../redux/ticketSlice';
import authReducer from '../redux/authSlice';
import userReducer from '../redux/profileSlice';
import bookingReducer from '../redux/bookingSlice';
import userBookingReducer from '../redux/userBookingSlice';
import bookingDetailReducer from '../redux/bookingDetailSlice';
import pdfReducer from '../redux/pdfSlice';


export const store = configureStore({
    reducer: {
        airline: airlineReducer,
        airports: airportReducer,
        country: countryReducer,
        plane: planeReducer,
        ticket: ticketReducer,
        auth: authReducer,
        user: userReducer,
        booking: bookingReducer,
        userBooking: userBookingReducer,
        bookingDetail: bookingDetailReducer,
        pdf: pdfReducer,
    },
});
