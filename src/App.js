import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ReviewBooking from "./components/reviewBooking/ReviewBooking";

import HomePage from "./pages/home/HomePage";
import SearchResultsPage from "./pages/detailPage/SearchResultPage";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/Register";
import "react-toastify/dist/ReactToastify.css";
import ThankYouPage from "./pages/thankYouPage/ThankYou";
import BookingsPage from "./pages/bookings/Bookings";
import TicketDetail from "./pages/ticketDetail/TicketDetail";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AirlinesPage from "./pages/airlinesPage/AirlinesPage";
import AirportsPage from "./pages/airportsPage/AirportsPage";
import CountriesPage from "./pages/countriesPage/CountriesPage";
import PlanesPage from "./pages/planesPage/PlanesPage";
import TicketPage from "./pages/ticketPage/TicketPage";
import { Provider } from "react-redux";
import { store } from "../src/ultis/store";
import { AuthProvider } from "./providers/AuthProvider";

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/review-booking" element={<ReviewBooking />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/booking/:id" element={<TicketDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/airlines" element={<AirlinesPage />} />
          <Route path="/airports" element={<AirportsPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          <Route path="/tickets" element={<TicketPage />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
        />
      </Router>
    </AuthProvider>
  </Provider>

);

export default App;
