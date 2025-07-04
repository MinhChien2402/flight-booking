// Libs
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
// Others
import { getUserReservations } from "../../thunk/userReservationThunk";
// Styles, images, icons
import { BiDownload } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

const BookedTicketsTable = ({ tickets, onAirlineClick, onDownloadPdf }) => {
  //#region Declare Hook
  const dispatch = useDispatch();
  const ITEMS_PER_PAGE = 3;
  //#endregion Declare Hook

  //#region Selector
  const { loading, error, reservations } = useSelector(
    (state) => state.userReservation
  );
  //#endregion Selector

  //#region Declare State
  const [currentPage, setCurrentPage] = useState(1);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    if (!loading && (!reservations || reservations.length === 0)) {
      dispatch(getUserReservations())
        .unwrap()
        .then((payload) => console.log("Fetched reservations:", payload))
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error(
            `Failed to fetch reservations: ${error.message || error}`
          );
        });
    }
  }, [dispatch, loading, reservations]);
  //#endregion Implement Hook

  //#region Handle Function
  const totalPages = Math.ceil((tickets || []).length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReservations = (tickets || []).slice(
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
      if (onAirlineClick) onAirlineClick(reservationId);
      else console.log("View details for reservation:", reservationId);
    }, 500),
    [onAirlineClick]
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

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error}
        <button onClick={() => dispatch(getUserReservations())}>Retry</button>
      </div>
    );
  if (!tickets || tickets.length === 0)
    return <div>No reservations available.</div>;
  //#endregion Handle Function

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-6 py-3 text-left font-semibold border-b border-gray-200">
              Airline
            </th>
            <th className="px-6 py-3 text-left font-semibold border-b border-gray-200">
              From
            </th>
            <th className="px-6 py-3 text-left font-semibold border-b border-gray-200">
              To
            </th>
            <th className="px-6 py-3 text-center font-semibold border-b border-gray-200">
              Departure
            </th>
            <th className="px-6 py-3 text-center font-semibold border-b border-gray-200">
              Arrival
            </th>
            <th className="px-6 py-3 text-center font-semibold border-b border-gray-200">
              Duration
            </th>
            <th className="px-6 py-3 text-center font-semibold border-b border-gray-200">
              Booked On
            </th>
            <th className="px-6 py-3 text-center font-semibold border-b border-gray-200">
              Total Fare
            </th>
            <th className="px-6 py-3 text-center font-semibold border-b border-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((ticket, index) => (
            <tr
              key={`${ticket.reservationId}-${index}`}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">
                {ticket.Airline || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">{ticket.From || "N/A"}</td>
              <td className="px-6 py-4 text-center">{ticket.To || "N/A"}</td>
              <td className="px-6 py-4 text-center">
                {ticket.Departure || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                {ticket.Arrival || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                {ticket.Duration || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                {ticket.BookedOn || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                ${ticket.TotalPrice?.toFixed(2) || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50"
                  onClick={() => handleDownloadPdf(ticket.reservationId)}
                  disabled={!ticket.reservationId}
                >
                  <BiDownload size={18} className="mr-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-6">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
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
