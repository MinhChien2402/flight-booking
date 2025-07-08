// Libs
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Components, Layouts, Pages
import ReviewReservation from "./components/reviewReservation/ReviewReservation"; // Đổi từ ReviewBooking
import HomePage from "./pages/home/HomePage";
import SearchResultsPage from "./pages/detailPage/SearchResultPage";
import LoginPage from "./pages/login/Login";
import RegisterPage from "./pages/register/Register";
import ThankYouPage from "./pages/thankYouPage/ThankYou";
import ReservationsPage from "./pages/reservationsPage/ReservationsPage"; // Đổi từ BookingsPage
import ReservationDetailPage from "./pages/reservationDetailPage/ReservationDetailPage"; // Đổi từ TicketDetail
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import AirlinesPage from "./pages/airlinesPage/AirlinesPage";
import AirportsPage from "./pages/airportsPage/AirportsPage";
import CountriesPage from "./pages/countriesPage/CountriesPage";
import AircraftsPage from "./pages/aircraftsPage/AircraftsPage"; // Đổi từ PlanesPage
import FlightSchedulesPage from "./pages/flightSchedulesPage/FlightSchedulesPage"; // Đổi từ TicketPage
import WelcomePage from "./components/welcomePage/WelcomePage";
// Others
import { Provider } from "react-redux";
import { store } from "../src/ultis/store";
import { AuthProvider } from "./providers/AuthProvider";
// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/search" element={<HomePage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/review-reservation" element={<ReviewReservation />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservation/:id" element={<ReservationDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/airlines" element={<AirlinesPage />} />
          <Route path="/airports" element={<AirportsPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/aircrafts" element={<AircraftsPage />} />
          <Route path="/flight-schedules" element={<FlightSchedulesPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          style={{ zIndex: 9999 }}
        />
      </Router>
    </AuthProvider>
  </Provider>
);

export default App;