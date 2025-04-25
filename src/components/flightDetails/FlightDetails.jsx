// Libs
import React from "react";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const FlightDetails = ({ flight }) => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden text-sm text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-300 bg-gray-100 px-4 py-2 font-semibold">
        {flight.from} ({flight.fromCode}) to {flight.to} ({flight.toCode}),{" "}
        {flight.departDate}
      </div>

      {/* Airline & Aircraft Info */}
      <div className="flex px-4 py-3 items-start gap-4 bg-white">
        <img
          src={flight.logo}
          alt={flight.airline}
          className="w-10 h-10 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/40";
          }}
        />
        <div className="flex-1 space-y-1">
          <div className="font-semibold">
            {flight.airline} | {flight.flightCode || "FI"}
          </div>
          <div>Aircraft: {flight.aircraft || "76W"}</div>
          <div>Operated by: {flight.airline}</div>
          <div>Flight Class: {flight.flightClass || "D"}</div>
          <div>Available Seats: {flight.availableSeats || 3}</div>
        </div>
      </div>

      {/* Departure & Arrival */}
      <div className="grid grid-cols-2 border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div>
          <div className="font-semibold text-blue-600 mb-1">Departure:</div>
          <div className="text-sm">{flight.departAirport}</div>
          <div className="text-xs text-gray-600">{flight.departCountry}</div>
          <div className="text-sm font-medium mt-1">
            {flight.departTime} - {flight.departDate}
          </div>
        </div>

        <div>
          <div className="font-semibold text-blue-600 mb-1">Arrival:</div>
          <div className="text-sm">{flight.arriveAirport}</div>
          <div className="text-xs text-gray-600">{flight.arriveCountry}</div>
          <div className="text-sm font-medium mt-1">
            {flight.arriveTime} - {flight.arriveDate}
          </div>
        </div>
      </div>

      {/* Baggage Info */}
      <div className="px-4 py-2 text-green-700 font-medium border-t border-gray-300 bg-white text-center">
        Baggage Info: Checked-In, Cabin
      </div>
    </div>
  );
};

export default FlightDetails;
