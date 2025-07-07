// Libs
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import Button from "../../components/button/Button";
// Others
import { getReservationDetail } from "../../thunk/reservationDetailThunk";
import { resetReservationDetailState } from "../../ultis/redux/reservationDetailSlice";

// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";

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
      dispatch(getReservationDetail(reservationId))
        .unwrap()
        .catch((err) => {
          toast.error(`Lỗi khi lấy chi tiết đặt chỗ: ${err.message || err}`);
        });
    }
    return () => {
      if (reservationId) {
        dispatch(resetReservationDetailState()); // Reset state khi unmount
      }
    };
  }, [dispatch, reservationId]);
  //#endregion Implement Hook

  //#region Handle Function
  if (!reservationId) return null; // Không hiển thị nếu không có reservationId

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-red-600">Lỗi: {error}</p>
          <Button
            primary
            className="mt-2 px-4 py-2 rounded"
            onClick={() => dispatch(getReservationDetail(reservationId))}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!reservationDetail) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-gray-600">Không tìm thấy thông tin đặt chỗ.</p>
          <Button primary className="mt-2 px-4 py-2 rounded" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    );
  }

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
    ) {
      return "N/A";
    }
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
          Chi tiết đặt chỗ
        </h2>
        <div className="text-left">
          <div className="detail-section mb-4">
            <p>
              <strong>Mã đặt chỗ:</strong>{" "}
              {reservationDetail.ReservationId || "N/A"}
            </p>
            <p>
              <strong>Mã xác nhận:</strong>{" "}
              {reservationDetail.ConfirmationNumber || "N/A"}
            </p>
            <p>
              <strong>Trạng thái:</strong> {reservationDetail.Status || "N/A"}
            </p>
            <p>
              <strong>Tổng giá:</strong> $
              {reservationDetail.TotalPrice?.toFixed(2) || "N/A"}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {formatDate(reservationDetail.BookedOn) || "N/A"}
            </p>
          </div>
          <div className="tickets-section mb-4">
            <h3 className="text-lg font-semibold">Vé</h3>
            {Array.isArray(reservationDetail.Tickets) &&
            reservationDetail.Tickets.length > 0 ? (
              reservationDetail.Tickets.map((ticket, index) => (
                <div key={index} className="mb-4 p-2 border rounded">
                  <div className="text-center mb-2">
                    <p className="font-bold">
                      Chuyến đến {ticket.To || "N/A"} -{" "}
                      {formatDate(ticket.Departure)} đến{" "}
                      {formatDate(ticket.Arrival)}
                    </p>
                  </div>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="font-bold">Hãng bay:</td>
                        <td>{ticket.Airline || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Từ:</td>
                        <td>{ticket.From || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Đến:</td>
                        <td>{ticket.To || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Khởi hành:</td>
                        <td>
                          {formatDate(ticket.Departure)}{" "}
                          {formatTime(ticket.Departure)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Đến nơi:</td>
                        <td>
                          {formatDate(ticket.Arrival)}{" "}
                          {formatTime(ticket.Arrival)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Thời gian bay:</td>
                        <td>
                          {calculateDuration(ticket.Departure, ticket.Arrival)}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-bold">Hạng ghế:</td>
                        <td>{ticket.FlightClass || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Giá:</td>
                        <td>${ticket.Price?.toFixed(2) || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                  {index < reservationDetail.Tickets.length - 1 && (
                    <hr className="my-2 border-gray-300" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">Không có thông tin vé.</p>
            )}
          </div>
          <div className="passengers-section">
            <h3 className="text-lg font-semibold">Hành khách</h3>
            {Array.isArray(reservationDetail.Passengers) &&
            reservationDetail.Passengers.length > 0 ? (
              reservationDetail.Passengers.map((passenger, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <p>
                    <strong>Danh xưng:</strong> {passenger.Title || "N/A"}
                  </p>
                  <p>
                    <strong>Họ tên:</strong> {passenger.FirstName || "N/A"}{" "}
                    {passenger.LastName || "N/A"}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong>{" "}
                    {formatDate(passenger.DateOfBirth) || "N/A"}
                  </p>
                  <p>
                    <strong>Số hộ chiếu:</strong>{" "}
                    {passenger.PassportNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Hạn hộ chiếu:</strong>{" "}
                    {formatDate(passenger.PassportExpiry) || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Không có thông tin hành khách.</p>
            )}
          </div>
          <div className="modal-actions mt-4 text-center">
            <Button
              primary
              className="px-4 py-2 rounded w-full"
              onClick={handleClose}
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
