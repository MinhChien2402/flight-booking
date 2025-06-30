// Libs
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Others
import { BiArrowBack } from "react-icons/bi";
import { resetReservationDetailState } from "../../ultis/redux/reservationDetailSlice";
import { getReservationDetail } from "../../thunk/reservationDetailThunk";

// Styles, images, icons

const ReservationDetailPage = () => {
  //#region Declare Hook
  const { id } = useParams(); // Lấy reservationId từ URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const {
    reservationDetail,
    loading: detailLoading,
    error: detailError,
  } = useSelector((state) => state.reservationDetail);
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    // Reset state khi vào trang
    dispatch(resetReservationDetailState());
    if (id) {
      dispatch(getReservationDetail(id))
        .unwrap()
        .catch((error) => {
          toast.error(
            `Failed to fetch reservation details: ${error.message || error}`
          );
          navigate("/reservations"); // Quay lại nếu lỗi
        });
    } else {
      navigate("/reservations"); // Quay lại nếu không có id
    }
  }, [dispatch, id, navigate]);
  //#endregion Implement Hook

  //#region Handle Function
  if (detailLoading) return <div className="p-4 text-center">Loading...</div>;
  if (detailError)
    return <div className="p-4 text-red-600 text-center">{detailError}</div>;
  if (!reservationDetail)
    return <div className="p-4">Reservation not found</div>;

  const ticket = reservationDetail.Tickets?.[0] || {}; // Lấy ticket đầu tiên (giả định 1 reservation có 1 ticket chính)
  const departureTime = ticket.DepartureTime
    ? new Date(ticket.DepartureTime)
    : null;
  const arrivalTime = ticket.ArrivalTime ? new Date(ticket.ArrivalTime) : null;

  const handleBack = () => {
    navigate(-1);
  };
  //#endregion Handle Function

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto mb-4">
          {/* Nút Back */}
          <button
            onClick={handleBack}
            className="text-blue-600 hover:underline text-sm mb-2 flex items-center gap-1"
          >
            <BiArrowBack size={16} /> Back
          </button>

          {/* Tiêu đề */}
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Review Your Reservation
          </h2>
        </div>

        {/* Thông tin vé */}
        <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto">
          {/* Header flight */}
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h3 className="text-blue-600 font-semibold text-lg">
              {ticket.DepartureAirport?.Name || "N/A"} -{" "}
              {ticket.ArrivalAirport?.Name || "N/A"}
            </h3>
            <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">
              View Baggage
            </button>
          </div>

          {/* Logo + flight info */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img
                src={ticket.Airline?.LogoUrl || "/default-logo.png"} // Giả định LogoUrl từ BE
                alt={ticket.Airline?.Name || "Unknown Airline"}
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {ticket.Airline?.Name || "Unknown Airline"}
                </p>
                <p className="text-sm text-gray-600">
                  Flight: {ticket.FlightNumber || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Aircraft: {ticket.Aircraft?.Name || "N/A"}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Class: <strong>{ticket.FlightClass || "N/A"}</strong>
            </div>
          </div>

          {/* Route */}
          <div className="flex justify-between items-center text-sm px-6 py-4 border-t">
            {/* Depart */}
            <div className="text-left">
              <p className="text-gray-500">Depart</p>
              <p className="text-xl font-semibold">
                {departureTime?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) || "N/A"}
              </p>
              <p className="text-blue-600">
                {departureTime?.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }) || "N/A"}
              </p>
              <p className="font-semibold">
                {ticket.DepartureAirport?.Code || "N/A"}
              </p>
              <p className="text-gray-500 text-xs">
                {ticket.DepartureAirport?.Name || "N/A"}
              </p>
            </div>

            {/* Line with stop */}
            <div className="text-center text-gray-600">
              <p>{ticket.Duration || "N/A"}</p>
              <p>{ticket.Stops > 0 ? `${ticket.Stops} stop(s)` : "Non-stop"}</p>
              <p className="text-xl">📍————✈️</p>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <p className="text-gray-500">Arrive</p>
              <p className="text-xl font-semibold">
                {arrivalTime?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) || "N/A"}
              </p>
              <p className="text-blue-600">
                {arrivalTime?.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }) || "N/A"}
              </p>
              <p className="font-semibold">
                {ticket.ArrivalAirport?.Code || "N/A"}
              </p>
              <p className="text-gray-500 text-xs">
                {ticket.ArrivalAirport?.Name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReservationDetailPage;
