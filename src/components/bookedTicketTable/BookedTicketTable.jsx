// Libs
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const BookedTicketsTable = ({ tickets }) => {
  //#region Declare Hook
  const ITEMS_PER_PAGE = 3;
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
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
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td
                className="px-4 py-3 text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate(`/booking/${ticket.id}`)}
              >
                {ticket.airline}
              </td>
              <td className="px-4 py-3">{ticket.from}</td>
              <td className="px-4 py-3">{ticket.to}</td>
              <td className="px-4 py-3">{ticket.departure}</td>
              <td className="px-4 py-3">{ticket.arrival}</td>
              <td className="px-4 py-3">{ticket.duration}</td>
              <td className="px-4 py-3">{ticket.bookedOn}</td>
            </tr>
          ))}
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
