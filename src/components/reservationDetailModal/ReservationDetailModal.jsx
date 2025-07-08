// Libs
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
// Components, Layouts, Pages
import Button from "../../components/button/Button";
// Others
import { resetReservationDetailState } from "../../ultis/redux/reservationDetailSlice";
// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";

const ReservationDetailModal = ({ reservationId, isOpen, onClose }) => {
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
    if (isOpen && reservationDetail) {
      const tickets =
        reservationDetail.tickets || reservationDetail.Tickets || [];
      const passengers =
        reservationDetail.passengers || reservationDetail.Passengers || [];
      if (!tickets.length) {
        toast.warn("Dữ liệu đặt chỗ không chứa thông tin vé hợp lệ.");
      }
      if (!passengers.length) {
        toast.warn("Dữ liệu đặt chỗ không chứa thông tin hành khách.");
      }
    } else if (isOpen && !reservationDetail) {
      console.warn(
        "No reservation detail available for reservationId:",
        reservationId
      );
      toast.error("Không có dữ liệu đặt chỗ để hiển thị.");
    } else if (!isOpen) {
      dispatch(resetReservationDetailState());
    }
  }, [dispatch, reservationId, isOpen]);

  if (!isOpen) return null;

  if (!reservationId) {
    //#endregion Implement Hook
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-gray-600">No reservation code provided.</p>
          <Button primary className="mt-2 px-4 py-2 rounded" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  if (
    error ||
    !reservationDetail ||
    typeof reservationDetail !== "object" ||
    Object.keys(reservationDetail).length === 0
  ) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-red-600">
            Error: {error || "No reservation or non -valid data found."}
          </p>
          <Button className="mt-2 px-4 py-2 rounded" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    dispatch(resetReservationDetailState());
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    const date = moment(dateString, [
      "DD/MM/YYYY HH:mm",
      "dd/MM/yyyy HH:mm",
      "YYYY-MM-DD HH:mm",
      "yyyy-MM-dd HH:mm",
      "DD/MM/YYYY",
      "dd/MM/yyyy",
      "YYYY-MM-DD",
      "yyyy-MM-dd",
      "YYYY-MM-DDTHH:mm:ss",
      "yyyy-MM-ddTHH:mm:ss",
      "YYYY-MM-DD HH:mm:ss",
      "yyyy-MM-dd HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "yyyy-MM-ddTHH:mm:ss.SSSZ",
    ]);
    const isValid = date.isValid();

    return isValid ? date.format("DD/MM/YYYY") : "N/A";
  };

  const formatTime = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    const date = moment(dateString, [
      "DD/MM/YYYY HH:mm",
      "dd/MM/yyyy HH:mm",
      "YYYY-MM-DD HH:mm",
      "yyyy-MM-dd HH:mm",
      "HH:mm",
      "YYYY-MM-DDTHH:mm:ss",
      "yyyy-MM-ddTHH:mm:ss",
      "YYYY-MM-DD HH:mm:ss",
      "yyyy-MM-dd HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "yyyy-MM-ddTHH:mm:ss.SSSZ",
    ]);
    const isValid = date.isValid();

    return isValid ? date.format("HH:mm") : "N/A";
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) {
      return "N/A";
    }

    const dep = moment(departureTime, [
      "DD/MM/YYYY HH:mm",
      "dd/MM/yyyy HH:mm",
      "YYYY-MM-DD HH:mm",
      "yyyy-MM-dd HH:mm",
      "YYYY-MM-DDTHH:mm:ss",
      "yyyy-MM-ddTHH:mm:ss",
      "YYYY-MM-DD HH:mm:ss",
      "yyyy-MM-dd HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "yyyy-MM-ddTHH:mm:ss.SSSZ",
    ]);
    const arr = moment(arrivalTime, [
      "DD/MM/YYYY HH:mm",
      "dd/MM/yyyy HH:mm",
      "YYYY-MM-DD HH:mm",
      "yyyy-MM-dd HH:mm",
      "YYYY-MM-DDTHH:mm:ss",
      "yyyy-MM-ddTHH:mm:ss",
      "YYYY-MM-DD HH:mm:ss",
      "yyyy-MM-dd HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "yyyy-MM-ddTHH:mm:ss.SSSZ",
    ]);
    if (!dep.isValid() || !arr.isValid()) {
      return "N/A";
    }
    const durationMs = arr.diff(dep);
    if (durationMs <= 0) {
      return "N/A";
    }
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${durationHours}h ${durationMinutes}m`;
  };

  // Normalize data to handle case sensitivity and missing fields
  const tickets = reservationDetail.tickets || reservationDetail.Tickets || [];
  const passengers =
    reservationDetail.passengers || reservationDetail.Passengers || [];
  const reservationData = {
    ReservationId:
      reservationDetail.reservationId ||
      reservationDetail.ReservationId ||
      "N/A",
    ConfirmationNumber:
      reservationDetail.confirmationNumber ||
      reservationDetail.ConfirmationNumber ||
      "N/A",
    Status: reservationDetail.status || reservationDetail.Status || "N/A",
    TotalPrice:
      reservationDetail.totalPrice || reservationDetail.TotalPrice || 0,
    BookedOn: reservationDetail.bookedOn || reservationDetail.BookedOn || null,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reservation Details
        </h2>
        <div className="text-left">
          <div className="detail-section mb-4">
            <p>
              <strong>Reservation code:</strong> {reservationData.ReservationId}
            </p>
            <p>
              <strong>Confirmation code:</strong>{" "}
              {reservationData.ConfirmationNumber}
            </p>
            <p>
              <strong>Status:</strong> {reservationData.Status}
            </p>
            <p>
              <strong>Total price:</strong> $
              {reservationData.TotalPrice
                ? reservationData.TotalPrice.toFixed(2)
                : "N/A"}
            </p>
            <p>
              <strong>Booked on:</strong> {formatDate(reservationData.BookedOn)}
            </p>
          </div>
          <div className="tickets-section mb-4">
            <h3 className="text-lg font-semibold">Ticket</h3>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <div key={index} className="mb-4 p-2 border rounded">
                  <div className="text-center mb-2">
                    <p className="font-bold">
                      {ticket.from || ticket.From || "N/A"} đến{" "}
                      {ticket.to || ticket.To || "N/A"}
                    </p>
                  </div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-bold">Airline:</td>
                        <td>{ticket.airline || ticket.Airline || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">From:</td>
                        <td>{ticket.from || ticket.From || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">To:</td>
                        <td>{ticket.to || ticket.To || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Depart:</td>
                        <td>
                          {formatDate(ticket.departure || ticket.Departure)}{" "}
                          {formatTime(ticket.departure || ticket.Departure)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Arrival:</td>
                        <td>
                          {formatDate(ticket.arrival || ticket.Arrival)}{" "}
                          {formatTime(ticket.arrival || ticket.Arrival)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Flight time:</td>
                        <td>
                          {calculateDuration(
                            ticket.departure || ticket.Departure,
                            ticket.arrival || ticket.Arrival
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Flight Class:</td>
                        <td>
                          {ticket.flightClass || ticket.FlightClass || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Price:</td>
                        <td>
                          ${(ticket.price || ticket.Price || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {index < tickets.length - 1 && (
                    <hr className="my-2 border-gray-300" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No ticket information.</p>
            )}
          </div>
          <div className="passengers-section">
            <h3 className="text-lg font-semibold">Passenger</h3>
            {passengers.length > 0 ? (
              passengers.map((passenger, index) => {
                return (
                  <div key={index} className="mb-2 p-2 border rounded">
                    <p>
                      <strong>Title:</strong>{" "}
                      {passenger.title || passenger.Title || "N/A"}
                    </p>
                    <p>
                      <strong>Full name:</strong>{" "}
                      {passenger.firstName || passenger.FirstName || "N/A"}{" "}
                      {passenger.lastName || passenger.LastName || "N/A"}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {formatDate(
                        passenger.dateOfBirth || passenger.date_of_birth
                      )}
                    </p>
                    <p>
                      <strong>Passport number:</strong>{" "}
                      {passenger.passportNumber ||
                        passenger.passport_number ||
                        passenger.PassportNumber ||
                        "N/A"}
                    </p>
                    <p>
                      <strong>Passport Expiry:</strong>{" "}
                      {formatDate(
                        passenger.passportExpiry || passenger.passport_expiry
                      )}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">
                There is no passenger information.
              </p>
            )}
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
      </div>
    </div>
  );
};

export default ReservationDetailModal;
