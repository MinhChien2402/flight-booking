// Libs
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
// Others

// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/button/Button"; // Thêm Button component để nhất quán
import { getReservationDetail } from "../../thunk/reservationDetailThunk";
import { resetReservationDetailState } from "../../ultis/redux/reservationDetailSlice";

const ReservationDetailModal = ({ reservationId, onClose }) => {
  //#region Declare Hook
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { reservationDetail, loading, error } = useSelector(
    (state) => state.reservationDetail
  );
  //#endregion Selector

  //#region Implement Hook
  useEffect(() => {
    if (reservationId) {
      dispatch(getReservationDetail(reservationId));
    }
    return () => {
      if (reservationId) {
        dispatch(resetReservationDetailState()); // Reset state khi unmount
      }
    };
  }, [dispatch, reservationId]);
  //#endregion Implement Hook

  //#region Handle Function
  if (loading) return <div className="modal loading">Loading...</div>;
  if (error)
    return (
      <div className="modal error">
        <p className="text-red-600">Error: {error}</p>
        <Button
          primary
          className="mt-2 px-4 py-2 rounded"
          onClick={() => dispatch(getReservationDetail(reservationId))}
        >
          Retry
        </Button>
      </div>
    );

  const handleClose = () => {
    dispatch(resetReservationDetailState()); // Reset state khi đóng
    onClose();
  };

  // Hàm chuyển đổi và định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB"); // Định dạng DD/MM/YYYY
  };

  const formatTime = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    if (
      !departureTime ||
      !arrivalTime ||
      isNaN(new Date(departureTime).getTime()) ||
      isNaN(new Date(arrivalTime).getTime())
    )
      return "N/A";
    const durationMs = new Date(arrivalTime) - new Date(departureTime);
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    return durationMs > 0 ? `${durationHours}h ${durationMinutes}m` : "N/A";
  };
  //#endregion Handle Function

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reservation Detail
        </h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-600 text-center">Error: {error}</p>}
        {reservationDetail && !loading && (
          <div className="text-left">
            <div className="detail-section mb-4">
              <p>
                <strong>Reservation ID:</strong>{" "}
                {reservationDetail.ReservationId}
              </p>
              <p>
                <strong>Confirmation Number:</strong>{" "}
                {reservationDetail.ConfirmationNumber || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {reservationDetail.Status}
              </p>
              <p>
                <strong>Total Price:</strong> $
                {reservationDetail.TotalPrice?.toFixed(2) || "N/A"}
              </p>
              <p>
                <strong>Booked On:</strong>{" "}
                {formatDate(reservationDetail.ReservationDate) || "N/A"}
              </p>
            </div>
            <div className="tickets-section mb-4">
              <h3 className="text-lg font-semibold">Tickets</h3>
              {reservationDetail.Tickets.map((ticket, index) => (
                <div key={index} className="mb-4 p-2 border rounded">
                  <div className="text-center mb-2">
                    <p className="font-bold">
                      Trip to {ticket.ArrivalAirport?.Name || "N/A"} -{" "}
                      {formatDate(ticket.DepartureTime)} to{" "}
                      {formatDate(ticket.ArrivalTime)}
                    </p>
                  </div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-bold">Airline:</td>
                        <td>{ticket.Airline?.Name || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">From:</td>
                        <td>{ticket.DepartureAirport?.Name || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">To:</td>
                        <td>{ticket.ArrivalAirport?.Name || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Departure:</td>
                        <td>
                          {formatDate(ticket.DepartureTime)}{" "}
                          {formatTime(ticket.DepartureTime)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Arrival:</td>
                        <td>
                          {formatDate(ticket.ArrivalTime)}{" "}
                          {formatTime(ticket.ArrivalTime)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Duration:</td>
                        <td>
                          {calculateDuration(
                            ticket.DepartureTime,
                            ticket.ArrivalTime
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Flight Class:</td>
                        <td>{ticket.FlightClass || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Price:</td>
                        <td>${ticket.Price?.toFixed(2) || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                  {index < reservationDetail.Tickets.length - 1 && (
                    <hr className="my-2 border-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="passengers-section">
              <h3 className="text-lg font-semibold">Passengers</h3>
              {reservationDetail.Passengers.map((passenger, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <p>
                    <strong>Title:</strong> {passenger.Title}
                  </p>
                  <p>
                    <strong>Name:</strong> {passenger.FirstName}{" "}
                    {passenger.LastName}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {formatDate(passenger.DateOfBirth)}
                  </p>
                  <p>
                    <strong>Passport Number:</strong> {passenger.PassportNumber}
                  </p>
                  <p>
                    <strong>Passport Expiry:</strong>{" "}
                    {formatDate(passenger.PassportExpiry)}
                  </p>
                </div>
              ))}
            </div>
            <div className="modal-actions mt-4 text-center">
              <Button
                primary
                className="px-4 py-2 rounded w-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailModal;
