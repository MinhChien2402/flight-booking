import React from "react";

const BookingDetailModal = ({
  isOpen,
  onClose,
  bookingDetail,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Ticket Detail</h2>
        {loading && <p>loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {bookingDetail && !loading && (
          <div>
            <p>
              <strong>Booking ID:</strong> {bookingDetail.bookingId}
            </p>
            <p>
              <strong>Airline:</strong> {bookingDetail.airline}
            </p>
            <p>
              <strong>From:</strong> {bookingDetail.from}
            </p>
            <p>
              <strong>To:</strong> {bookingDetail.to}
            </p>
            <p>
              <strong>Departure:</strong> {bookingDetail.departure}
            </p>
            <p>
              <strong>Arrival:</strong> {bookingDetail.arrival}
            </p>
            <p>
              <strong>Total:</strong> {bookingDetail.totalPrice}
            </p>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingDetailModal;
