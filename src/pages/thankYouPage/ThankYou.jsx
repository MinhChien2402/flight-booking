// Libs
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { getUserReservations } from "../../thunk/userReservationThunk";
// Others
// Styles, images, icons

const ThankYouPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { reservations, loading, error } = useSelector(
    (state) => state.userReservation
  );
  const location = useNavigate().location.state || {};
  const { reservationId, outboundFlight, returnFlight } = location;
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    if (!reservations.length && !loading && !error) {
      dispatch(getUserReservations()); // Tải lại danh sách đặt chỗ
    }
  }, [dispatch, reservations.length, loading, error]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleViewTicket = () => {
    navigate("/bookings");
  };
  //#endregion Handle Function

  const latestReservation = reservations.find(
    (res) => res.id === reservationId
  ) || { ConfirmationNumber: "N/A", TotalPrice: "N/A" };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
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
              {latestReservation.ConfirmationNumber}
            </p>
            <p className="text-gray-700 text-center mb-4">
              <strong>Total Price:</strong> ${latestReservation.TotalPrice}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ThankYouPage;
