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
import { BiArrowBack } from "react-icons/bi";

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
  const {
    loading: ticketLoading,
    error: ticketError,
    outboundTickets,
    returnTickets,
  } = useSelector((state) => state.ticket);
  //#endregion Selector

  //#region Declare State
  const [searchParams, setSearchParams] = useState(
    location.state?.searchParams || {}
  );
  const memoizedSearchParams = useMemo(() => {
    console.log("memoizedSearchParams updated:", {
      DepartureAirportId: searchParams.DepartureAirportId || "",
      ArrivalAirportId: searchParams.ArrivalAirportId || "",
      DepartureDate: searchParams.DepartureDate || "",
      ReturnDate: searchParams.ReturnDate || "",
      TripType: searchParams.TripType || "oneWay",
      Adults: parseInt(searchParams.Adults) || 1,
      Children: parseInt(searchParams.Children) || 0,
      FlightClass: searchParams.FlightClass || "Economy",
    });
    return {
      DepartureAirportId: searchParams.DepartureAirportId || "",
      ArrivalAirportId: searchParams.ArrivalAirportId || "",
      DepartureDate: searchParams.DepartureDate || "",
      ReturnDate: searchParams.ReturnDate || "",
      TripType: searchParams.TripType || "oneWay",
      Adults: parseInt(searchParams.Adults) || 1,
      Children: parseInt(searchParams.Children) || 0,
      FlightClass: searchParams.FlightClass || "Economy",
    };
  }, [
    searchParams.DepartureAirportId,
    searchParams.ArrivalAirportId,
    searchParams.DepartureDate,
    searchParams.ReturnDate,
    searchParams.TripType,
    searchParams.Adults,
    searchParams.Children,
    searchParams.FlightClass,
  ]);

  const [openDetails, setOpenDetails] = useState(null);
  const [selectedOutboundTicket, setSelectedOutboundTicket] = useState(null);
  const [selectedReturnTicket, setSelectedReturnTicket] = useState(null);
  const [loading, setLoading] = useState(false);
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

  //#region Handle Function
  const handleSearch = useCallback(
    async (params) => {
      console.log("Handling search with params:", params);
      setSearchParams(params);
      setLoading(true);
      setSelectedOutboundTicket(null);
      setSelectedReturnTicket(null);
      try {
        const result = await dispatch(searchTickets(params)).unwrap();
        console.log("Full API Response:", result);
        if (result.message) {
          toast.info(result.message);
        }
      } catch (error) {
        console.error("Search failed:", error);
        toast.error(
          "Lỗi khi tìm kiếm vé: " + (error.message || "Đã có lỗi xảy ra")
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const toggleDetails = (id) => {
    setOpenDetails(openDetails === id ? null : id);
  };

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

    const formatFlightData = (ticket) => {
      if (!ticket) return null;
      const airline = airlines.find((a) => a?.id === ticket?.airline?.id) || {
        name: "Unknown Airline",
      };
      const departureAirport = airports.find(
        (a) => a?.id === ticket?.departureAirport?.id
      ) || { code: "N/A", name: "N/A" };
      const arrivalAirport = airports.find(
        (a) => a?.id === ticket?.arrivalAirport?.id
      ) || { code: "N/A", name: "N/A" };

      const basePrice = ticket?.adultPrice || ticket?.basePrice || 300;
      const pricePerAdult = basePrice / memoizedSearchParams.Adults || 300;
      const adultPrice = basePrice;
      const childPrice = pricePerAdult * 0.7 * memoizedSearchParams.Children;
      const totalPrice = adultPrice + childPrice;

      const departureTime = ticket?.departureTime
        ? new Date(ticket.departureTime)
        : null;
      const arrivalTime = ticket?.arrivalTime
        ? new Date(ticket.arrivalTime)
        : null;

      return {
        id: ticket?.id || "unknown",
        ticketId: ticket?.id || "unknown",
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
            ? `${Math.floor((arrivalTime - departureTime) / (1000 * 60 * 60))}h`
            : "N/A",
        stops:
          ticket?.stops !== undefined
            ? ticket.stops === 0
              ? "Non-stop"
              : `${ticket.stops} stop(s)`
            : "N/A",
        price: `$${totalPrice.toFixed(2)}`,
        refundable:
          ticket?.flightClass === "economy" ? "Refundable" : "Non-refunded",
        availableSeats: ticket?.availableSeats || "N/A",
        departAirport: departureAirport.name || "N/A",
        arriveAirport: arrivalAirport.name || "N/A",
      };
    };

    const bookingData = {
      outboundFlight: selectedOutboundTicket
        ? formatFlightData(selectedOutboundTicket)
        : null,
      returnFlight:
        selectedReturnTicket && memoizedSearchParams.TripType === "roundTrip"
          ? formatFlightData(selectedReturnTicket)
          : null,
      searchParams,
    };

    navigate("/review-booking", {
      state: bookingData,
    });
  };

  const formatFlightData = (ticket) => {
    const airline = airlines.find((a) => a?.id === ticket?.airline?.id) || {
      name: "Unknown Airline",
    };
    const departureAirport = airports.find(
      (a) => a?.id === ticket?.departureAirport?.id
    ) || { code: "N/A", name: "N/A" };
    const arrivalAirport = airports.find(
      (a) => a?.id === ticket?.arrivalAirport?.id
    ) || { code: "N/A", name: "N/A" };

    const basePrice = ticket?.adultPrice || ticket?.basePrice || 300;
    const pricePerAdult = basePrice / memoizedSearchParams.Adults || 300;
    const adultPrice = basePrice;
    const childPrice = pricePerAdult * 0.7 * memoizedSearchParams.Children;
    const totalPrice = adultPrice + childPrice;

    const departureTime = ticket?.departureTime
      ? new Date(ticket.departureTime)
      : null;
    const arrivalTime = ticket?.arrivalTime
      ? new Date(ticket.arrivalTime)
      : null;

    return {
      id: ticket?.id || "unknown",
      ticketId: ticket?.id || "unknown",
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
          ? `${Math.floor((arrivalTime - departureTime) / (1000 * 60 * 60))}h`
          : "N/A",
      stops:
        ticket?.stops !== undefined
          ? ticket.stops === 0
            ? "Non-stop"
            : `${ticket.stops} stop(s)`
          : "N/A",
      price: `$${totalPrice.toFixed(2)}`,
      refundable:
        ticket?.flightClass === "economy" ? "Refundable" : "Non-refunded",
      availableSeats: ticket?.availableSeats || "N/A",
      departAirport: departureAirport.name || "N/A",
      arriveAirport: arrivalAirport.name || "N/A",
    };
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (selectedOutboundTicket) {
      const outboundPrice =
        selectedOutboundTicket.totalPrice ||
        selectedOutboundTicket.basePrice ||
        300;
      total += outboundPrice;
    }
    if (selectedReturnTicket && memoizedSearchParams.TripType === "roundTrip") {
      const returnPrice =
        selectedReturnTicket.totalPrice ||
        selectedReturnTicket.basePrice ||
        300;
      total += returnPrice;
    }
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
          Search results
        </h2>

        {(loading || airlineLoading || airportLoading || ticketLoading) && (
          <p>Loading...</p>
        )}
        {(airlineError || airportError || ticketError) && (
          <p className="text-red-500">
            Error: {airlineError || airportError || ticketError}
          </p>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Ticket selected
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
                          <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                            onClick={() => setSelectedOutboundTicket(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                            onClick={() => toggleDetails(flight.id)}
                          >
                            {openDetails === flight.id ? "Hidden" : "Detail"}
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
                            <button
                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                              onClick={() => setSelectedReturnTicket(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs w-[80px]"
                              onClick={() => toggleDetails(flight.id)}
                            >
                              {openDetails === flight.id ? "Hidden" : "Detail"}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                          openDetails === flight.id
                            ? "max-h-[500px]"
                            : "max-h-0"
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
                Book Now
              </Button>
            </div>
          )}
        </div>

        {/* Hiển thị các vé outbound */}
        {Array.isArray(outboundTickets) && outboundTickets.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Outbound Trip
            </h3>
            {outboundTickets.map((ticket) => {
              if (selectedOutboundTicket?.id === ticket.id) return null;
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
                        <div className="text-xs text-gray-600">{flight.to}</div>
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
                          Book Now
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
          </>
        )}

        {/* Hiển thị các vé return (nếu là roundtrip) */}
        {memoizedSearchParams.TripType === "roundTrip" &&
          Array.isArray(returnTickets) &&
          returnTickets.length > 0 && (
            <>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
                Return Trip
              </h3>
              {returnTickets.map((ticket) => {
                if (selectedReturnTicket?.id === ticket.id) return null;
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
                      <div className="flex flex-col items-end w-1/5 text right text-sm space-y-1">
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
                            Book Now
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
            </>
          )}

        {/* Thông báo khi không tìm thấy vé */}
        {!loading &&
          !airlineLoading &&
          !airportLoading &&
          !ticketLoading &&
          outboundTickets.length === 0 &&
          (memoizedSearchParams.TripType !== "roundTrip" ||
            returnTickets.length === 0) && <p>No suitable flight found.</p>}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
