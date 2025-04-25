// Libs
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import FlightSearchForm from "../../components/flightSearchForm/FlightSearchForm";
import Button from "../../components/button/Button";
import FlightDetails from "../../components/flightDetails/FlightDetails";
import FlightDetailsHeader from "../../components/flightDetails/FlightDetailsHeader";
// Others
import { mockFlightData } from "../../mock/mockData";
import Footer from "../../components/footer/Footer";

// Styles, images, icons

const SearchResultsPage = ({ logo }) => {
  //#region Declare Hook
  const location = useLocation();
  const searchData = location.state;
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [openDetails, setOpenDetails] = useState(null);
  const [imageSrc, setImageSrc] = useState(logo);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    setImageSrc(logo);
  }, [logo]);
  //#endregion Implement Hook

  //#region Handle Function
  const toggleDetails = (id) => {
    setOpenDetails(openDetails === id ? null : id);
  };

  const handleBookNow = (flight) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/review-booking", { state: flight });
  };

  //#endregion Handle Function

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto p-4">
        <FlightSearchForm defaultData={searchData} />

        <h2 className="text-2xl font-bold my-6 text-gray-800">
          Search Results
        </h2>

        {mockFlightData.map((flight) => (
          <div
            key={flight.id}
            className="flex flex-col bg-white rounded-lg shadow px-4 py-3 mb-6 border border-gray-200"
          >
            {/* Flight Row Main Content */}
            <div className="flex items-center justify-between w-full">
              {/* Left: Logo + Airline */}
              <div className="flex items-center space-x-3 w-1/5">
                <img
                  src={flight.logo}
                  alt={flight.airline}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/error_img.jpg";
                  }}
                />
                <div className="text-sm font-semibold text-sky-700">
                  {flight.airline}
                </div>
              </div>

              {/* Middle: Depart, Duration, Arrive */}
              <div className="flex justify-between w-3/5 text-center text-sm">
                {/* Depart */}
                <div className="w-1/3">
                  <div className="text-xs text-gray-500">Depart</div>
                  <div className="text-lg font-bold">{flight.departTime}</div>
                  <div className="text-xs text-gray-600">
                    {flight.departDate}
                  </div>
                  <div className="text-xs text-gray-600">{flight.from}</div>
                </div>

                {/* Duration */}
                <div className="w-1/3 flex flex-col items-center justify-center">
                  <div className="text-blue-600 font-semibold">
                    {flight.duration}
                  </div>
                  <div className="text-xs text-gray-500">{flight.stops}</div>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-pink-500">📍</span>
                    <div className="border-b border-dashed border-gray-400 w-12 mx-2"></div>
                    <span className="text-blue-500">✈️</span>
                  </div>
                </div>

                {/* Arrive */}
                <div className="w-1/3">
                  <div className="text-xs text-gray-500">Arrive</div>
                  <div className="text-lg font-bold">{flight.arriveTime}</div>
                  <div className="text-xs text-gray-600">
                    {flight.arriveDate}
                  </div>
                  <div className="text-xs text-gray-600">{flight.to}</div>
                </div>
              </div>

              {/* Right: Price & Actions */}
              <div className="flex flex-col items-end w-1/5 text-right text-sm space-y-1">
                <div className="text-xs text-gray-500">Price</div>
                <div className="text-base font-bold text-gray-800">
                  {flight.price}
                </div>
                <div className="text-xs text-green-600">
                  {flight.refundable}
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    primary
                    className="text-xs px-2 py-1 w-[80px]"
                    onClick={() => handleBookNow(flight)}
                  >
                    Book Now
                  </Button>

                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                    onClick={() => toggleDetails(flight.id)}
                  >
                    {openDetails === flight.id ? "Hide" : "Details"}
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Details Accordion */}
            <div
              className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                openDetails === flight.id ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              {openDetails === flight.id && (
                <div className="border border-gray-300 rounded-md mt-2 overflow-hidden">
                  <FlightDetailsHeader flight={flight} />
                  <FlightDetails flight={flight} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
