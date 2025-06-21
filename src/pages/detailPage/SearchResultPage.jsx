// Libs
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components
import Header from "../../components/header/Header";
import FlightSearchForm from "../../components/flightSearchForm/FlightSearchForm";
import Button from "../../components/button/Button";
import FlightDetails from "../../components/flightDetails/FlightDetails";
import FlightDetailsHeader from "../../components/flightDetails/FlightDetailsHeader";
import Footer from "../../components/footer/Footer";
// Others
import { searchFlightSchedules } from "../../thunk/flightScheduleThunk";
import { getAirlines } from "../../thunk/airlineThunk";
import { getListAirports } from "../../thunk/airportThunk";
// Icons
import { BiArrowBack } from "react-icons/bi";

const SearchResultPage = () => {
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
  } = useSelector((state) => state.airport);
  const {
    outboundTickets,
    returnTickets,
    loading: flightScheduleLoading,
    error: flightScheduleError,
  } = useSelector((state) => state.flightSchedule);
  //#endregion Selector

  //#region Declare State
  const [searchParams, setSearchParams] = useState(
    location.state?.searchParams || {}
  );
  const memoizedSearchParams = useMemo(
    () => ({
      DepartureAirportId: searchParams.DepartureAirportId || "",
      ArrivalAirportId: searchParams.ArrivalAirportId || "",
      DepartureDate: searchParams.DepartureDate || "",
      ReturnDate: searchParams.ReturnDate || "",
      TripType: searchParams.TripType || "oneWay",
      Adults: parseInt(searchParams.Adults) || 1,
      Children: parseInt(searchParams.Children) || 0,
      FlightClass: searchParams.FlightClass || "Economy",
    }),
    [
      searchParams.DepartureAirportId,
      searchParams.ArrivalAirportId,
      searchParams.DepartureDate,
      searchParams.ReturnDate,
      searchParams.TripType,
      searchParams.Adults,
      searchParams.Children,
      searchParams.FlightClass,
    ]
  );

  const [openDetails, setOpenDetails] = useState(null);
  const [selectedOutboundTicket, setSelectedOutboundTicket] = useState(null);
  const [selectedReturnTicket, setSelectedReturnTicket] = useState(null);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getAirlines());
    dispatch(getListAirports());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.searchParams) {
      setSearchParams(location.state.searchParams);
      handleSearch(location.state.searchParams);
    }
  }, [location.state?.searchParams]);
  //#endregion Implement Hook

  //#region Utility Function
  const formatFlightData = (ticket) => {
    if (!ticket) return null;
    const airline = airlines.find((a) => a?.id === ticket?.AirlineId) || {
      name: "Unknown Airline",
    };
    const departureAirport = airports.find(
      (a) => a?.id === ticket?.DepartureAirportId
    ) || { code: "N/A", name: "N/A" };
    const arrivalAirport = airports.find(
      (a) => a?.id === ticket?.ArrivalAirportId
    ) || { code: "N/A", name: "N/A" };

    const basePrice = ticket?.AdultPrice || ticket?.BasePrice || 0;
    const pricePerAdult = basePrice / memoizedSearchParams.Adults || 300;
    const adultPrice = basePrice;
    const childPrice = pricePerAdult * 0.7 * memoizedSearchParams.Children;
    const totalPrice = adultPrice + childPrice;

    const departureTime = ticket?.DepartureTime
      ? new Date(ticket.DepartureTime)
      : null;
    const arrivalTime = ticket?.ArrivalTime
      ? new Date(ticket.ArrivalTime)
      : null;

    return {
      id: ticket?.Id || "unknown",
      ticketId: ticket?.Id || "unknown",
      airline: airline.name || "Unknown Airline",
      departTime: departureTime
        ? departureTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      departDate: departureTime ? departureTime.toLocaleDateString() : "N/A",
      from: departureAirport.code || "N/A",
      arriveTime: arrivalTime
        ? arrivalTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      arriveDate: arrivalTime ? arrivalTime.toLocaleDateString() : "N/A",
      to: arrivalAirport.code || "N/A",
      duration:
        departureTime && arrivalTime
          ? `${Math.floor(
              (arrivalTime - departureTime) / (1000 * 60 * 60)
            )}h ${Math.floor(
              ((arrivalTime - departureTime) % (1000 * 60 * 60)) / (1000 * 60)
            )}m`
          : "N/A",
      stops:
        ticket?.Stops !== undefined
          ? ticket.Stops === 0
            ? "Non-stop"
            : `${ticket.Stops} stop(s)`
          : "N/A",
      price: `$${totalPrice.toFixed(2)}`,
      refundable:
        ticket?.FlightClass === "economy" ? "Refundable" : "Non-refunded",
      availableSeats: ticket?.AvailableSeats || "N/A",
      departAirport: departureAirport.name || "N/A",
      arriveAirport: arrivalAirport.name || "N/A",
    };
  };
  //#endregion Utility Function

  //#region Handle Function
  const handleSearch = useCallback(
    async (params) => {
      setSearchParams(params);
      try {
        await dispatch(searchFlightSchedules(params)).unwrap();
        if (!outboundTickets.length && !returnTickets.length) {
          toast.info("No suitable flight found.");
        }
      } catch (error) {
        console.error("Search failed:", error);
        toast.error(
          "Lỗi khi tìm kiếm vé: " + (error.message || "Đã có lỗi xảy ra")
        );
      }
    },
    [dispatch, outboundTickets.length, returnTickets.length]
  );

  const toggleDetails = (id) => setOpenDetails(openDetails === id ? null : id);

  const handleSelectTicket = (ticket, isOutbound) => {
    if (isOutbound) {
      setSelectedOutboundTicket(ticket);
    } else {
      setSelectedReturnTicket(ticket);
    }
  };

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (
      memoizedSearchParams.TripType === "roundTrip" &&
      (!selectedOutboundTicket || !selectedReturnTicket)
    ) {
      toast.error("Please choose both outbound trip and return trip tickets!");
      return;
    }

    const bookingData = {
      outboundFlight: selectedOutboundTicket
        ? formatFlightData(selectedOutboundTicket)
        : null,
      returnFlight:
        selectedReturnTicket && memoizedSearchParams.TripType === "roundTrip"
          ? formatFlightData(selectedReturnTicket)
          : null,
      searchParams: memoizedSearchParams,
    };

    navigate("/review-booking", { state: bookingData });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedOutboundTicket)
      total +=
        selectedOutboundTicket.TotalPrice ||
        selectedOutboundTicket.BasePrice ||
        300;
    if (selectedReturnTicket && memoizedSearchParams.TripType === "roundTrip")
      total +=
        selectedReturnTicket.TotalPrice ||
        selectedReturnTicket.BasePrice ||
        300;
    return `$${total.toFixed(2)}`;
  };
  //#endregion Handle Function

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[190px] mt-3"
        onClick={() => navigate("/")}
      >
        <BiArrowBack size={20} />
      </Button>
      <div className="max-w-6xl mx-auto p-4">
        <FlightSearchForm
          defaultData={memoizedSearchParams}
          onSearch={handleSearch}
        />

        <h2 className="text-2xl font-bold my-6 text-gray-800">
          Search Results
        </h2>

        {(flightScheduleLoading || airlineLoading || airportLoading) && (
          <p>Loading...</p>
        )}
        {(airlineError || airportError || flightScheduleError) && (
          <p className="text-red-500">
            Error: {airlineError || airportError || flightScheduleError}
          </p>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Ticket Selected
          </h3>
          {selectedOutboundTicket && (
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-700">
                Outbound Trip
              </h4>
              {(() => {
                const flight = formatFlightData(selectedOutboundTicket);
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
                          <div className="text-lg font-bold">
                            {flight.departTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.departDate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.from}
                          </div>
                        </div>
                        <div className="w-1/3 flex flex-col items-center justify-center">
                          <div className="text-blue-600 font-semibold">
                            {flight.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.stops}
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            <span className="text-pink-500">📍</span>
                            <div className="border-b border-dashed border-gray-400 w-12 mx-2"></div>
                            <span className="text-blue-500">✈️</span>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="text-xs text-gray-500">Arrive</div>
                          <div className="text-lg font-bold">
                            {flight.arriveTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.arriveDate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.to}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end w-1/5 text-right text-sm space-y-1">
                        <div className="text-xs text-gray-500">Giá</div>
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
                            onClick={() => setSelectedOutboundTicket(null)}
                          >
                            Cancel
                          </Button>
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                            onClick={() => toggleDetails(flight.id)}
                          >
                            {openDetails === flight.id ? "Hidden" : "Detail"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {openDetails === flight.id && (
                      <div className="border border-gray-300 rounded-md mt-2 overflow-hidden">
                        <FlightDetailsHeader flight={flight} />
                        <FlightDetails flight={flight} />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {selectedReturnTicket &&
            memoizedSearchParams.TripType === "roundTrip" && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-700">
                  Return Trip
                </h4>
                {(() => {
                  const flight = formatFlightData(selectedReturnTicket);
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
                            <div className="text-lg font-bold">
                              {flight.departTime}
                            </div>
                            <div className="text-xs text-gray-600">
                              {flight.departDate}
                            </div>
                            <div className="text-xs text-gray-600">
                              {flight.from}
                            </div>
                          </div>
                          <div className="w-1/3 flex flex-col items-center justify-center">
                            <div className="text-blue-600 font-semibold">
                              {flight.duration}
                            </div>
                            <div className="text-xs text-gray-500">
                              {flight.stops}
                            </div>
                            <div className="flex items-center justify-center mt-1">
                              <span className="text-pink-500">📍</span>
                              <div className="border-b border-dashed border-gray-400 w-12 mx-2"></div>
                              <span className="text-blue-500">✈️</span>
                            </div>
                          </div>
                          <div className="w-1/3">
                            <div className="text-xs text-gray-500">Arrive</div>
                            <div className="text-lg font-bold">
                              {flight.arriveTime}
                            </div>
                            <div className="text-xs text-gray-600">
                              {flight.arriveDate}
                            </div>
                            <div className="text-xs text-gray-600">
                              {flight.to}
                            </div>
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
                              onClick={() => setSelectedReturnTicket(null)}
                            >
                              Cancel
                            </Button>
                            <button
                              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                              onClick={() => toggleDetails(flight.id)}
                            >
                              {openDetails === flight.id ? "Hidden" : "Detail"}
                            </button>
                          </div>
                        </div>
                      </div>
                      {openDetails === flight.id && (
                        <div className="border border-gray-300 rounded-md mt-2 overflow-hidden">
                          <FlightDetailsHeader flight={flight} />
                          <FlightDetails flight={flight} />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

          {(selectedOutboundTicket || selectedReturnTicket) && (
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold text-gray-800">
                Price: {calculateTotalPrice()}
              </div>
              <Button
                primary
                className="text-sm px-4 py-2"
                onClick={handleBookNow}
              >
                Proceed to Review
              </Button>
            </div>
          )}
        </div>

        {!selectedOutboundTicket &&
          Array.isArray(outboundTickets) &&
          outboundTickets.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Outbound Trip
              </h3>
              {outboundTickets.map((ticket) => {
                if (selectedOutboundTicket?.Id === ticket.Id) return null;
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
                          <div className="text-lg font-bold">
                            {flight.departTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.departDate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.from}
                          </div>
                        </div>
                        <div className="w-1/3 flex flex-col items-center justify-center">
                          <div className="text-blue-600 font-semibold">
                            {flight.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.stops}
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            <span className="text-pink-500">📍</span>
                            <div className="border-b border-dashed border-gray-400 w-12 mx-2"></div>
                            <span className="text-blue-500">✈️</span>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="text-xs text-gray-500">Arrive</div>
                          <div className="text-lg font-bold">
                            {flight.arriveTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.arriveDate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.to}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end w-1/5 text-right text-sm space-y-1">
                        <div className="text-xs text-gray-500">Giá</div>
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
                            onClick={() => handleSelectTicket(ticket, true)}
                          >
                            Select
                          </Button>
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                            onClick={() => toggleDetails(flight.id)}
                          >
                            {openDetails === flight.id ? "Hidden" : "Detail"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {openDetails === flight.id && (
                      <div className="border border-gray-300 rounded-md mt-2 overflow-hidden">
                        <FlightDetailsHeader flight={flight} />
                        <FlightDetails flight={flight} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

        {memoizedSearchParams.TripType === "roundTrip" &&
          !selectedReturnTicket &&
          Array.isArray(returnTickets) &&
          returnTickets.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
                Return Trip
              </h3>
              {returnTickets.map((ticket) => {
                if (selectedReturnTicket?.Id === ticket.Id) return null;
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
                          <div className="text-lg font-bold">
                            {flight.departTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.departDate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.from}
                          </div>
                        </div>
                        <div className="w-1/3 flex flex-col items-center justify-center">
                          <div className="text-blue-600 font-semibold">
                            {flight.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.stops}
                          </div>
                          <div className="flex items-center justify-center mt-1">
                            <span className="text-pink-500">📍</span>
                            <div className="border-b border-dashed border-gray-400 w-12 mx-2"></div>
                            <span className="text-blue-500">✈️</span>
                          </div>
                        </div>
                        <div className="w-1/3">
                          <div className="text-xs text-gray-500">Arrive</div>
                          <div className="text-lg font-bold">
                            {flight.arriveTime}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.arriveDate}
                          </div>
                          <div className="text-xs text-gray-600">
                            {flight.to}
                          </div>
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
                            onClick={() => handleSelectTicket(ticket, false)}
                          >
                            Select
                          </Button>
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                            onClick={() => toggleDetails(flight.id)}
                          >
                            {openDetails === flight.id ? "Hidden" : "Detail"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {openDetails === flight.id && (
                      <div className="border border-gray-300 rounded-md mt-2 overflow-hidden">
                        <FlightDetailsHeader flight={flight} />
                        <FlightDetails flight={flight} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

        {!selectedOutboundTicket &&
          !flightScheduleLoading &&
          !airlineLoading &&
          !airportLoading &&
          outboundTickets.length === 0 &&
          (memoizedSearchParams.TripType !== "roundTrip" ||
            returnTickets.length === 0) && (
            <p className="text-center text-gray-600">
              No suitable flight found.
            </p>
          )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultPage;
