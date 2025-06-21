// Libs
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
// Others
// Styles, images, icons
import { BiDownload } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { getUserReservations } from "../../thunk/userReservationThunk";

const BookedTicketsTable = () => {
  //#region Declare Hook
  const dispatch = useDispatch();
  const ITEMS_PER_PAGE = 3;
  //#endregion Declare Hook

  //#region Selector
  const { reservations, status, error } = useSelector(
    (state) => state.reservation
  );
  //#endregion Selector

  //#region Declare State
  const [currentPage, setCurrentPage] = useState(1);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getUserReservations());
  }, [dispatch]);
  //#endregion Implement Hook

  //#region Handle Function
  const totalPages = Math.ceil(reservations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReservations = reservations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const debouncedOnAirlineClick = useCallback(
    debounce((reservationId) => {
      // Implement navigation or detail view logic here
      console.log("View details for reservation:", reservationId);
    }, 500),
    []
  );

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleDownloadPdf = async (reservationId) => {
    try {
      const response = await fetch(`/api/Reservation/${reservationId}/pdf`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to download PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservation_${reservationId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(`Lỗi: ${error.message || "Download failure"}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formatDateOnly = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const datePart = dateString.split(" ")[0].replace(/,$/, "");
    return datePart;
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed")
    return (
      <div>
        Error: {error}
        <button onClick={() => dispatch(getUserReservations())}>Retry</button>
      </div>
    );
  //#endregion Handle Function

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-3 text-left font-semibold">Airline</th>
            <th className="px-4 py-3 text-left font-semibold">From</th>
            <th className="px-4 py-3 text-left font-semibold">To</th>
            <th className="px-4 py-3 text-left font-semibold">Departure</th>
            <th className="px-4 py-3 text-left font-semibold">Arrival</th>
            <th className="px-4 py-3 text-left font-semibold">Duration</th>
            <th className="px-4 py-3 text-left font-semibold">Booked On</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Total Fare</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((res) =>
            res.tickets.map((ticket, index) => (
              <tr
                key={`${res.reservationId}-${index}`}
                className="border-b hover:bg-gray-50"
              >
                <td
                  className="px-4 py-3 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => debouncedOnAirlineClick(res.reservationId)}
                >
                  {ticket.airline?.name || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {ticket.departureAirport?.name || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {ticket.arrivalAirport?.name || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {formatDateOnly(ticket.departureTime) || "N/A"}
                </td>
                <td className="px-4 py-3">
                  {formatDateOnly(ticket.arrivalTime) || "N/A"}
                </td>
                <td className="px-4 py-3">{ticket.duration || "N/A"}</td>
                <td className="px-4 py-3">
                  {formatDateOnly(res.bookedOn) || "N/A"}
                </td>
                <td className="px-4 py-3">{res.status || "N/A"}</td>
                <td className="px-4 py-3">
                  ${res.totalPrice?.toFixed(2) || "N/A"}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                    onClick={() => handleDownloadPdf(res.reservationId)}
                    disabled={!res.reservationId}
                  >
                    <BiDownload size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedTicketsTable;
