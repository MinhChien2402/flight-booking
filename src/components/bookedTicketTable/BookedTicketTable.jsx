// Libs
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BiDownload } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";

// Components, Layouts, Pages
// Others
import { getUserReservations } from "../../thunk/userReservationThunk";
import { confirmReservation } from "../../thunk/reservationThunk";

// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";

const BookedTicketsTable = ({
  tickets,
  onAirlineClick,
  onDownloadPdf,
  onReschedule,
  onCancel,
}) => {
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
  const activeReservations = (tickets || []).filter(
    (ticket) => ticket.Status !== "Cancelled"
  );
  const currentReservations = activeReservations.slice(
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
    (reservationId) => {
      if (onAirlineClick) {
        console.log(
          "Calling onAirlineClick with reservationId:",
          reservationId
        );
        onAirlineClick(reservationId);
      } else {
        console.log(
          "onAirlineClick not provided, reservationId:",
          reservationId
        );
      }
    },
    [onAirlineClick]
  );

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

  const handleConfirm = async (reservationId) => {
    try {
      const response = await dispatch(
        confirmReservation(reservationId)
      ).unwrap();
      toast.success(
        `Reservation confirmed! Confirmation Number: ${response.confirmationNumber}`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      // Cập nhật danh sách vé
      dispatch(getUserReservations());
    } catch (error) {
      console.error("Confirm error:", error);
      toast.error(`Failed to confirm reservation: ${error.message || error}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleRescheduleClick = (reservationId) => {
    if (onReschedule) onReschedule(reservationId);
  };

  const handleCancelClick = (reservationId) => {
    if (onCancel) {
      console.log("Calling onCancel with reservationId:", reservationId);
      onCancel(reservationId);
    } else {
      console.log("onCancel not provided, reservationId:", reservationId);
    }
  };
  //#endregion Handle Function

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error}
        <button onClick={() => dispatch(getUserReservations())}>Retry</button>
      </div>
    );
  if (!activeReservations.length)
    return <div>No active reservations available.</div>;

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
              Status
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
              <td
                className="px-6 py-4 text-blue-600 hover:underline cursor-pointer"
                onClick={() => {
                  console.log(
                    "Airline clicked, reservationId:",
                    ticket.reservationId
                  );
                  debouncedOnAirlineClick(ticket.reservationId);
                }}
              >
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
                {ticket.Status || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  {ticket.Status === "Blocked" && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                      onClick={() => handleConfirm(ticket.reservationId)}
                      disabled={!ticket.reservationId}
                    >
                      Confirm
                    </button>
                  )}
                  {ticket.Status === "Confirmed" && (
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
                      onClick={() =>
                        handleRescheduleClick(ticket.reservationId)
                      }
                      disabled={!ticket.reservationId}
                    >
                      Reschedule
                    </button>
                  )}
                  {(ticket.Status === "Blocked" ||
                    ticket.Status === "Confirmed") && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                      onClick={() => handleCancelClick(ticket.reservationId)}
                      disabled={!ticket.reservationId}
                      title="Cancel Reservation"
                    >
                      <FaTrash size={18} className="mr-2" />
                      Cancel
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50"
                    onClick={() => handleDownloadPdf(ticket.reservationId)}
                    disabled={!ticket.reservationId}
                  >
                    <BiDownload size={18} className="mr-2" />
                  </button>
                </div>
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
              className="px-6 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition-colors"
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
