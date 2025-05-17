// Libs
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import FlightSearchForm from "../../components/flightSearchForm/FlightSearchForm";
import Button from "../../components/button/Button";
import FlightDetails from "../../components/flightDetails/FlightDetails";
import FlightDetailsHeader from "../../components/flightDetails/FlightDetailsHeader";
import Footer from "../../components/footer/Footer";
// Others
import { searchTickets } from "../../thunk/ticketThunk";
import { getAirlines } from "../../thunk/airlineThunk";
import { getListAirports } from "../../thunk/airportThunk";
// Styles, images, icons

const SearchResultsPage = () => {
  //#region Declare Hook
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const {
    list: airlines,
    loading: airlineLoading,
    error: airlineError,
  } = useSelector((state) => state.airline);
  const {
    data: airports,
    loading: airportLoading,
    error: airportError,
  } = useSelector((state) => state.airports);
  //#endregion Selector

  //#region Declare State
  const [searchParams, setSearchParams] = useState(location.state || {});
  const memoizedSearchParams = useMemo(
    () => searchParams,
    [
      searchParams.departureAirportId,
      searchParams.arrivalAirportId,
      searchParams.departureDate,
      searchParams.returnDate,
      searchParams.tripType,
      searchParams.travellers,
      searchParams.flightClass,
    ]
  );

  const [openDetails, setOpenDetails] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getAirlines());
    dispatch(getListAirports());
  }, [dispatch]);

  useEffect(() => {
    if (location.state) {
      setSearchParams(location.state);
      handleSearch(location.state);
    }
  }, [location.state]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleSearch = useCallback(
    async (params) => {
      console.log("handleSearch called with:", params);
      setLoading(true);
      try {
        const result = await dispatch(searchTickets(params)).unwrap();
        console.log("Search result:", result); // Log dữ liệu từ API
        setSearchParams(params);
        setFilteredTickets(result);
      } catch (error) {
        console.error("Search failed:", error);
        toast.error(
          "Lỗi khi tìm kiếm vé: " + (error.message || "Đã có lỗi xảy ra")
        );
        setFilteredTickets([]);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

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

  const formatFlightData = (ticket) => {
    const airline = airlines.find((a) => a.id === ticket.airlineId) || {};
    const departureAirport =
      airports.find((a) => a.id === ticket.departureAirportId) || {};
    const arrivalAirport =
      airports.find((a) => a.id === ticket.arrivalAirportId) || {};

    return {
      id: ticket.id,
      ticketId: ticket.id, // Thêm trường ticketId để nhất quán với ReviewBooking
      airline: airline.name || "Unknown Airline",
      departTime: new Date(ticket.departureTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      departDate: new Date(ticket.departureTime).toLocaleDateString(),
      from: departureAirport.code || "N/A",
      arriveTime: new Date(ticket.arrivalTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      arriveDate: new Date(ticket.arrivalTime).toLocaleDateString(),
      to: arrivalAirport.code || "N/A",
      duration: `${Math.floor(
        (new Date(ticket.arrivalTime) - new Date(ticket.departureTime)) /
          (1000 * 60 * 60)
      )}h`,
      stops: ticket.stops === 0 ? "Non-stop" : `${ticket.stops} stop(s)`,
      price: `$${ticket.price.toFixed(2)}`,
      refundable:
        ticket.flightClass === "Economy" ? "Refundable" : "Non-refunded",
    };
  };
  //#endregion Handle Function

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <FlightSearchForm
          defaultData={memoizedSearchParams}
          onSearch={handleSearch}
        />
        <h2 className="text-2xl font-bold my-6 text-gray-800">
          Search results
        </h2>
        {(loading || airlineLoading || airportLoading) && <p>loading...</p>}
        {(airlineError || airportError) && (
          <p className="text-red-500">Lỗi: {airlineError || airportError}</p>
        )}
        {!loading &&
          !airlineLoading &&
          !airportLoading &&
          filteredTickets.length === 0 && <p>No suitable flight found.</p>}
        {filteredTickets.map((ticket) => {
          const flight = formatFlightData(ticket);
          return (
            <div
              key={flight.id}
              className="flex flex-col bg-white rounded-lg shadow px-4 py-3 mb-6 border border-gray-200"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3 w-1/5">
                  <div className="text-sm font-semibold text-sky-700">
                    {flight.airline}
                  </div>
                </div>
                <div className="flex justify-between w-3/5 text-center text-sm">
                  <div className="w-1/3">
                    <div className="text-xs text-gray-500">Depart</div>
                    <div className="text-lg font-bold">{flight.departTime}</div>
                    <div className="text-xs text-gray-600">
                      {flight.departDate}
                    </div>
                    <div className="text-xs text-gray-600">{flight.from}</div>
                  </div>
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
                  <div className="w-1/3">
                    <div className="text-xs text-gray-500">Arrive</div>
                    <div className="text-lg font-bold">{flight.arriveTime}</div>
                    <div className="text-xs text-gray-600">
                      {flight.arriveDate}
                    </div>
                    <div className="text-xs text-gray-600">{flight.to}</div>
                  </div>
                </div>
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
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
