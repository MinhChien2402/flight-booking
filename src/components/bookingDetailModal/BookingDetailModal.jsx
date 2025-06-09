import React from "react";

const BookingDetailModal = ({
  isOpen,
  onClose,
  bookingDetail,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  // Hàm định dạng ngày tháng thành DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Định dạng DD/MM/YYYY
  };

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
            <div className="text-center mb-4">
              <p className="font-bold">
                DATE {formatDate(bookingDetail.departure)} - DATE{" "}
                {formatDate(bookingDetail.arrival)} TRIP TO {bookingDetail.to},
              </p>
              {/* <div className="flex justify-center">
                <span className="text-2xl font-bold">Vietnam Airlines</span>
              </div> */}
            </div>

            <div className="mb-2">
              <p>
                <strong>Booking Code:</strong>
              </p>
              <p>
                <strong>Departure:</strong> Tuesday{" "}
                {formatDate(bookingDetail.departure)} To: Wednesday{" "}
                {formatDate(bookingDetail.arrival)}
              </p>
            </div>

            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="font-bold">{bookingDetail.airline}</td>
                  <td>{bookingDetail.from}</td>
                  <td>{bookingDetail.to}</td>
                </tr>
                <tr>
                  <td>Flight Time:</td>
                  <td>
                    {new Date(bookingDetail.departure).toLocaleTimeString()}
                  </td>
                  <td>
                    {new Date(bookingDetail.arrival).toLocaleTimeString()}
                  </td>
                </tr>
                <tr>
                  <td>Flight Duration:</td>
                  <td colSpan="2">{bookingDetail.duration}</td>
                </tr>
              </tbody>
            </table>

            {/* <div className="mb-2">
              <p>
                <strong>Passenger Name:</strong>{" "}
                {bookingDetail.passengerName || "Passenger"}
              </p>
            </div> */}

            <div className="text-center">
              <p className="font-bold">
                Ticket Code: {bookingDetail.bookingId}
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
