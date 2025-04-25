// Libs
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Others
import { mockTickets } from "../../mock/mockData";
// Styles, images, icons

const TicketDetail = () => {
  //#region Declare Hook
  const { id } = useParams();
  const navigate = useNavigate();

  const ticket = mockTickets.find((t) => t.id === id);
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  if (!ticket) return <div className="p-4">Ticket not found</div>;
  //#endregion Handle Function

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-3xl mx-auto mb-4">
          {/* Nút Back */}
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline text-sm mb-2 flex items-center gap-1"
          >
            ← Back
          </button>

          {/* Tiêu đề */}
          <h2 className="text-2xl font-bold text-red-600 mb-6">
            Review Your Booking
          </h2>
        </div>

        {/* Thông tin vé */}
        <div className="bg-white shadow-md rounded-lg max-w-3xl mx-auto">
          {/* Header flight */}
          <div className="flex justify-between items-center border-b px-6 py-4">
            <h3 className="text-blue-600 font-semibold text-lg">
              {ticket.from}-{ticket.to}
            </h3>
            <button className="bg-red-500 text-white px-4 py-1 rounded text-sm">
              View Baggage
            </button>
          </div>

          {/* Logo + flight info */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img
                src={ticket.logo}
                alt={ticket.airline}
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-medium text-gray-800">{ticket.airline}</p>
                <p className="text-sm text-gray-600">
                  Flight: {ticket.flightNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Aircraft: {ticket.aircraft}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Class: <strong>{ticket.class}</strong>
            </div>
          </div>

          {/* Route */}
          <div className="flex justify-between items-center text-sm px-6 py-4 border-t">
            {/* Depart */}
            <div className="text-left">
              <p className="text-gray-500">Depart</p>
              <p className="text-xl font-semibold">
                {ticket.departure.split(" - ")[1]}
              </p>
              <p className="text-blue-600">
                {ticket.departure.split(" - ")[0]}
              </p>
              <p className="font-semibold">{ticket.from}</p>
              <p className="text-gray-500 text-xs">{ticket.fromFull}</p>
            </div>

            {/* Line with stop */}
            <div className="text-center text-gray-600">
              <p>{ticket.duration}</p>
              <p>{ticket.stops}</p>
              <p className="text-xl">📍&mdash;&mdash;&mdash;&mdash;✈️</p>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <p className="text-gray-500">Arrive</p>
              <p className="text-xl font-semibold">
                {ticket.arrival.split(" - ")[1]}
              </p>
              <p className="text-blue-600">{ticket.arrival.split(" - ")[0]}</p>
              <p className="font-semibold">{ticket.to}</p>
              <p className="text-gray-500 text-xs">{ticket.toFull}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TicketDetail;
