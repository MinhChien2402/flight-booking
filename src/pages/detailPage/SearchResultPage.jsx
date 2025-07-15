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
import { blockReservation } from "../../thunk/reservationThunk";

// Icons
import { BiArrowBack } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

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
  } = useSelector(
    (state) => state.airports || { data: [], loading: false, error: null }
  );
  const {
    outboundTickets,
    returnTickets,
    loading: flightScheduleLoading,
    error: flightScheduleError,
  } = useSelector(
    (state) =>
      state.flightSchedule || {
        outboundTickets: [],
        returnTickets: [],
        loading: false,
        error: null,
      }
  );
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
      Infants: parseInt(searchParams.Infants) || 0,
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
      searchParams.Infants, // Thêm vào dependencies
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
    if (
      location.state?.searchParams &&
      airlines.length > 0 &&
      airports.length > 0
    ) {
      setSearchParams(location.state.searchParams);
      handleSearch(location.state.searchParams);
    }
  }, [
    location.state?.searchParams,
    airlines.length,
    airports.length,
    dispatch,
  ]);
  //#endregion Implement Hook

  //#region Utility Function
  const formatFlightData = (ticket) => {
    if (!ticket) {
      return null;
    }

    const airline = ticket?.airline || { name: "Unknown Airline" };
    const departureAirport = ticket?.departureAirport || {
      code: "N/A",
      name: "N/A",
    };
    const arrivalAirport = ticket?.arrivalAirport || {
      code: "N/A",
      name: "N/A",
    };

    // Giả sử basePrice là giá cho một người lớn
    const basePricePerAdult = ticket?.price || 300; // Giá cơ bản cho một người lớn
    const adultPrice = basePricePerAdult * memoizedSearchParams.Adults; // Tổng giá cho người lớn
    const childPrice = basePricePerAdult * 0.7 * memoizedSearchParams.Children; // Tổng giá cho trẻ em (70% giá người lớn)
    const infantPrice = basePricePerAdult * 0.1 * memoizedSearchParams.Infants; // Tổng giá cho trẻ sơ sinh (10% giá người lớn, theo thực tế)
    const totalPrice = adultPrice + childPrice + infantPrice; // Tổng giá

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
      departureTime: departureTime,
      from: departureAirport.code || departureAirport.name || "N/A",
      arriveTime: arrivalTime
        ? arrivalTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      arriveDate: arrivalTime ? arrivalTime.toLocaleDateString() : "N/A",
      to: arrivalAirport.code || arrivalAirport.name || "N/A",
      duration:
        departureTime && arrivalTime
          ? `${Math.floor(
              (arrivalTime - departureTime) / (1000 * 60 * 60)
            )}h ${Math.floor(
              ((arrivalTime - departureTime) % (1000 * 60 * 60)) / (1000 * 60)
            )}m`
          : "N/A",
      stops:
        ticket?.stops !== undefined
          ? ticket.stops === 0
            ? "Non-stop"
            : `${ticket.stops} stop(s)`
          : "N/A",
      price: `$${totalPrice.toFixed(2)}`,
      originalPrice: `$${basePricePerAdult.toFixed(2)}`, // Giá gốc cho một người lớn
      refundable:
        ticket?.flightClass?.toLowerCase() === "economy"
          ? "Refundable"
          : "Non-refunded",
      availableSeats: ticket?.availableSeats || "N/A",
      departAirport: departureAirport.name || "N/A",
      arriveAirport: arrivalAirport.name || "N/A",
      flightClass: ticket?.flightClass || "N/A",
    };
  };
  //#endregion Utility Function

  //#region Handle Function
  const handleSearch = useCallback(
    async (params) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Handling search with params:", params);
      }
      setSearchParams(params); // Cập nhật searchParams với tham số mới
      try {
        const formattedParams = {
          ...params,
          DepartureDate: params.DepartureDate
            ? new Date(params.DepartureDate).toISOString().split("T")[0]
            : "",
          ReturnDate: params.ReturnDate
            ? new Date(params.ReturnDate).toISOString().split("T")[0]
            : "",
          FlightClass: params.FlightClass
            ? params.FlightClass.toLowerCase()
            : "economy",
        };
        const result = await dispatch(
          searchFlightSchedules(formattedParams)
        ).unwrap();
        if (process.env.NODE_ENV === "development") {
          console.log("Search result:", result);
        }
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

  const toggleDetails = (id) => {
    setOpenDetails(openDetails === id ? null : id); // Đảm bảo không ảnh hưởng state tìm kiếm
  };

  const handleSelectTicket = (ticket, isOutbound) => {
    if (isOutbound) {
      setSelectedOutboundTicket(ticket);
    } else {
      setSelectedReturnTicket(ticket);
    }
  };

  const handleBlockTicket = async (ticketId) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const ticket =
        outboundTickets.find((t) => t.id === ticketId) ||
        returnTickets.find((t) => t.id === ticketId);
      if (!ticket) {
        toast.error("Không tìm thấy vé!");
        return;
      }

      const departureTime = new Date(
        ticket.departureTime || ticket.DepartureTime
      );
      const daysDiff = (departureTime - new Date()) / (1000 * 60 * 60 * 24);

      if (daysDiff < 14) {
        toast.error(
          "Không thể đặt vé tạm thời, ngày khởi hành trong vòng 2 tuần."
        );
        return;
      }

      console.log(`Blocking ticket with ID: ${ticketId}`);
      const response = await dispatch(
        blockReservation({ FlightScheduleId: ticketId })
      ).unwrap();
      console.log("Block response:", JSON.stringify(response, null, 2));

      if (response?.message === "Reservation blocked") {
        console.log(
          "Calling toast.success for reservationId:",
          response.reservationId
        );
        toast.success(
          `Vé đã được đặt tạm thời! Mã đặt vé: ${response.reservationId}`,
          {
            autoClose: 5000,
            position: "bottom-right",
          }
        );
        setTimeout(() => {
          console.log("Navigating to /reservations");
          navigate("/reservations");
        }, 2000);
      } else {
        console.log("Response invalid:", response);
        toast.error(
          `Không thể đặt vé tạm thời: ${
            response?.message || "Lỗi không xác định"
          }`
        );
      }
    } catch (error) {
      console.error("Block error details:", error);
      toast.error(`Lỗi: ${error.message || "Đã có lỗi xảy ra"}`);
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
      toast.error("Vui lòng chọn vé cho cả chuyến đi và chuyến về!");
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

    navigate("/review-reservation", { state: bookingData });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    const adults = memoizedSearchParams.Adults;
    const children = memoizedSearchParams.Children;
    const infants = memoizedSearchParams.Infants;

    if (selectedOutboundTicket) {
      const base = selectedOutboundTicket.price || 300;
      total += base * adults + base * 0.7 * children + base * 0.1 * infants;
    }
    if (selectedReturnTicket && memoizedSearchParams.TripType === "roundTrip") {
      const base = selectedReturnTicket.price || 300;
      total += base * adults + base * 0.7 * children + base * 0.1 * infants;
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
                        <div className="text-xs text-gray-600">
                          Original: {flight.originalPrice}
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

          {/* Hiển thị danh sách vé tìm thấy */}
          {!selectedOutboundTicket && outboundTickets.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-700">
                Available Outbound Flights
              </h4>
              {outboundTickets.map((ticket) => {
                const flight = formatFlightData(ticket);
                const canBlock =
                  flight.departureTime &&
                  (flight.departureTime - new Date()) / (1000 * 60 * 60 * 24) >
                    14;
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
                          {canBlock && (
                            <Button
                              className="text-xs px-2 py-1 w-[80px] bg-yellow-500 text-white hover:bg-yellow-600"
                              onClick={() => handleBlockTicket(ticket.id)}
                            >
                              Block
                            </Button>
                          )}
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
            </div>
          )}

          {!selectedReturnTicket &&
            memoizedSearchParams.TripType === "roundTrip" &&
            returnTickets.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-700">
                  Available Return Flights
                </h4>
                {returnTickets.map((ticket) => {
                  const flight = formatFlightData(ticket);
                  const canBlock =
                    flight.departureTime &&
                    (flight.departureTime - new Date()) /
                      (1000 * 60 * 60 * 24) >
                      14;
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
                            {canBlock && (
                              <Button
                                className="text-xs px-2 py-1 w-[80px] bg-yellow-500 text-white hover:bg-yellow-600"
                                onClick={() => handleBlockTicket(ticket.id)}
                              >
                                Block
                              </Button>
                            )}
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

          {!selectedOutboundTicket &&
            !selectedReturnTicket &&
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
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultPage;
