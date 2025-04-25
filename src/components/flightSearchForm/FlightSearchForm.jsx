// Libs
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import TravellersDropdown from "../traverllerDropdown/TravellersDropdown";
import CityAutocomplete from "../cityAutocomplete/CityAutocomplete";
// Others
// Styles, images, icons

const FlightSearchForm = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [tripType, setTripType] = useState("oneWay");
  const [departureCity, setDepartureCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [travellersInfo, setTravellersInfo] = useState({
    displayText: "1 & Economy",
    adults: 1,
    children: 0,
    seatType: "Economy",
  });
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleTripTypeChange = (type) => {
    setTripType(type);
  };

  const handleTravellersChange = useCallback((info) => {
    setTravellersInfo(info);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      tripType,
      departureCity,
      destinationCity,
      departureDate,
      travellers: `${travellersInfo.adults} Adults, ${travellersInfo.children} Children, ${travellersInfo.seatType}`,
    });

    navigate(`/search-results?${queryParams.toString()}`);
  };
  //#endregion Handle Function

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-visible">
        {/* Trip Type Selection */}
        <div className="flex p-2 bg-gray-100 rounded-t-lg">
          <button
            className={`py-2 px-4 rounded-md mr-2 ${
              tripType === "oneWay"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => handleTripTypeChange("oneWay")}
            type="button"
          >
            One Way
          </button>
          <button
            className={`py-2 px-4 rounded-md mr-2 ${
              tripType === "roundTrip"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => handleTripTypeChange("roundTrip")}
            type="button"
          >
            Return Trip
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Departure City - Replace input with CityAutocomplete */}
            <div className="z-40">
              <CityAutocomplete
                value={departureCity}
                onChange={setDepartureCity}
                placeholder="Select Departure City"
                label="Departure City"
              />
            </div>

            {/* Destination City - Replace input with CityAutocomplete */}
            <div className="z-30">
              <CityAutocomplete
                value={destinationCity}
                onChange={setDestinationCity}
                placeholder="Select Destination City"
                label="Destination City"
              />
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-gray-700 mb-2">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                placeholder="Select Date"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Travellers & Seat */}
            <div className="relative z-20">
              <TravellersDropdown onChange={handleTravellersChange} />
            </div>
          </div>

          {/* Return Date - Only show if roundTrip is selected */}
          {tripType === "roundTrip" && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    placeholder="Select Date"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-200"
            >
              Search flights
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightSearchForm;
