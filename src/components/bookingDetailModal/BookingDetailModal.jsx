import React from "react";

const BookingDetailModal = ({
  isOpen,
  onClose,
  bookingDetail,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  // Hàm chuyển đổi và định dạng ngày tháng từ dd/mm/yyyy sang định dạng hợp lệ
  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Kiểm tra định dạng dd/mm/yyyy hoặc dd/mm/yyyy hh:mm
    const dateParts = dateString.split(" ")[0].split("/");
    const timePart = dateString.split(" ")[1];
    if (
      dateParts.length === 3 &&
      !isNaN(dateParts[0]) &&
      !isNaN(dateParts[1]) &&
      !isNaN(dateParts[2])
    ) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Tháng trong JS bắt đầu từ 0
      const year = parseInt(dateParts[2], 10);
      const date = timePart
        ? new Date(year, month, day, ...timePart.split(":"))
        : new Date(year, month, day);
      return isNaN(date.getTime()) ? null : date;
    }
    return new Date(dateString); // Thử phân tích định dạng mặc định
  };

  // Hàm định dạng ngày tháng thành DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) {
      console.log("Invalid date string:", dateString); // Debug giá trị không hợp lệ
      return "N/A";
    }
    return date.toLocaleDateString("en-GB"); // Định dạng DD/MM/YYYY
  };

  // Hàm định dạng giờ (dùng cho Flight Time nếu cần)
  const formatTime = (dateString) => {
    const date = parseDate(dateString);
    if (!date || isNaN(date.getTime())) {
      console.log("Invalid time string:", dateString); // Debug giá trị không hợp lệ
      return "N/A";
    }
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Log dữ liệu thô từ tickets để debug
  console.log("Booking Detail Data:", bookingDetail);
  console.log(
    "Raw Tickets Data:",
    bookingDetail?.tickets || bookingDetail?.Tickets
  );

  // Xử lý cả Tickets và tickets để đảm bảo tương thích
  const tickets = bookingDetail?.Tickets || bookingDetail?.tickets || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Ticket Detail
        </h2>
        {loading && <p className="text-center">loading...</p>}
        {error && <p className="text-red-600 text-center">Error: {error}</p>}
        {bookingDetail && !loading && (
          <div className="text-left">
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => {
                const departure = ticket.Departure || ticket.departure;
                const arrival = ticket.Arrival || ticket.arrival;
                const duration = ticket.Duration || ticket.duration;

                return (
                  <div key={index} className="mb-4">
                    <div className="text-center mb-2">
                      <p className="font-bold">
                        DATE {formatDate(departure)} - DATE{" "}
                        {formatDate(arrival)} TRIP TO{" "}
                        {ticket.To || ticket.to || "N/A"},
                      </p>
                    </div>

                    <div className="mb-2">
                      <p>
                        <strong>Booking Code:</strong>{" "}
                        {bookingDetail.BookingId ||
                          bookingDetail.bookingId ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Departure:</strong> {formatDate(departure)} To:{" "}
                        {formatDate(arrival)}
                      </p>
                    </div>

                    <table className="w-full mb-2">
                      <tbody>
                        <tr>
                          <td className="font-bold">
                            {ticket.Airline || ticket.airline || "N/A"}
                          </td>
                          <td>{ticket.From || ticket.from || "N/A"}</td>
                          <td>{ticket.To || ticket.to || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Flight Time:</td>
                          <td>{formatTime(departure) || "N/A"}</td>
                          <td>{formatTime(arrival) || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Flight Duration:</td>
                          <td colSpan="2">{duration || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                    {index < tickets.length - 1 && (
                      <hr className="my-2 border-gray-300" />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-600">
                No ticket details available.
              </p>
            )}

            <div className="text-center mt-4">
              <p className="font-bold">
                Total Price: $
                {(
                  bookingDetail.TotalPrice ||
                  bookingDetail.totalPrice ||
                  0
                ).toFixed(2)}
              </p>
              <p className="font-bold">
                Ticket Code:{" "}
                {bookingDetail.BookingId || bookingDetail.bookingId || "N/A"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingDetailModal;
