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
  if (!flight) {
    return (
      <div className="p-4 text-gray-600">Flight details not available</div>
    );
  }
  //#endregion Handle Function

  return (
    <div className="bg-white border border-gray-300 rounded-md overflow-hidden text-sm text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-300 bg-gray-100 px-4 py-2 font-semibold">
        {flight.from} to {flight.to}, {flight.departDate || "N/A"}
      </div>

      {/* Airline & Available Seats Info */}
      <div className="px-4 py-3 bg-white">
        <div className="space-y-1">
          <div>Operated by: {flight.airline || "N/A"}</div>
          <div>Available Seats: {flight.availableSeats || "N/A"}</div>
        </div>
      </div>

      {/* Departure & Arrival */}
      <div className="grid grid-cols-2 border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div>
          <div className="font-semibold text-blue-600 mb-1">Departure:</div>
          <div className="text-sm">{flight.departAirport || "N/A"}</div>
          <div className="text-sm font-medium mt-1">
            {flight.departTime || "N/A"} - {flight.departDate || "N/A"}
          </div>
        </div>
        <div>
          <div className="font-semibold text-blue-600 mb-1">Arrival:</div>
          <div className="text-sm">{flight.arriveAirport || "N/A"}</div>
          <div className="text-sm font-medium mt-1">
            {flight.arriveTime || "N/A"} - {flight.arriveDate || "N/A"}
          </div>
        </div>
      </div>

      {/* Baggage Info & Additional Details */}
      <div className="px-4 py-2 text-green-700 font-medium border-t border-gray-300 bg-white text-center">
        Baggage Info: Checked-In, Cabin
      </div>
      <div className="px-4 py-2 border-t border-gray-300 bg-white text-center">
        <div>Duration: {flight.duration || "N/A"}</div>
        <div>Stops: {flight.stops || "N/A"}</div>
        <div>Flight Class: {flight.flightClass || "N/A"}</div>
        <div>Price: {flight.price || "N/A"}</div>
      </div>
    </div>
  );
};

export default FlightDetails;
