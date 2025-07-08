// Libs
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Others
import { getUserReservations } from "../../thunk/userReservationThunk";
// Styles, images, icons

const ThankYouPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  //#endregion Declare Hook
  //#region Selector
  const { reservations, loading, error } = useSelector(
    (state) => state.userReservation
  );

  // Lấy dữ liệu từ location.state, bao gồm confirmationNumber và totalPrice
  const {
    reservationId,
    outboundFlight,
    returnFlight,
    confirmationNumber,
    totalPrice,
  } = location.state || {};
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    if (!reservationId) {
      console.log("No reservationId found in location.state");
      return;
    }
    // Luôn gọi lại để lấy dữ liệu mới nhất
    dispatch(getUserReservations());
  }, [dispatch, reservationId]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleViewTicket = () => {
    navigate("/reservations");
  };

  // Sử dụng dữ liệu từ location.state làm ưu tiên, fallback sang reservations
  const latestReservation = reservations.find(
    (res) => res.reservationId === reservationId
  ) || {
    confirmationNumber: confirmationNumber || "N/A",
    totalPrice: totalPrice || "N/A",
  };

  if (!reservationId) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
          <p className="text-red-600 text-center">
            No reservation information available. Please try again.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md font-semibold mt-4"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  //#endregion Handle Function

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">
          Thank You for Your Reservation!
        </h1>
        <p className="text-gray-700 text-center max-w-md mb-4">
          Your reservation is confirmed. Please keep your ticket for your
          journey.
        </p>
        {loading ? (
          <p className="text-center">Loading reservation details...</p>
        ) : error ? (
          <p className="text-red-600 text-center">Error: {error}</p>
        ) : (
          <>
            <p className="text-gray-700 text-center mb-4">
              <strong>Confirmation Number:</strong>{" "}
              {latestReservation.confirmationNumber}
            </p>
            <p className="text-gray-700 text-center mb-4">
              <strong>Total Price:</strong> ${latestReservation.totalPrice}
            </p>
            <button
              onClick={handleViewTicket}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md font-semibold"
            >
              View My Reservation
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
