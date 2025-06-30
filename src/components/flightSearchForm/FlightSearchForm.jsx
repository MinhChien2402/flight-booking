// Libs
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect"; // Import reselect
import { toast } from "react-toastify";
// Components, Layouts, Pages
import TravellersDropdown from "../traverllerDropdown/TravellersDropdown";
import CityAutocomplete from "../cityAutocomplete/CityAutocomplete";
// Others
import { searchFlightSchedules } from "../../thunk/flightScheduleThunk";
import { getListAirports } from "../../thunk/airportThunk"; // Import để gọi API
// Styles, images, icons

const selectAirports = createSelector(
  (state) => state.airports, // Sửa từ state.airport thành state.airports
  (airportsState) => airportsState?.data || []
);

const FlightSearchForm = ({ onSearch = () => {}, defaultData = {} }) => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    airports,
    loading: airportsLoading,
    error: airportsError,
  } = useSelector((state) => {
    const airportsState = state.airports || {
      loading: false,
      error: null,
      data: [],
    };
    return {
      airports: selectAirports(state),
      loading: airportsState.loading,
      error: airportsState.error,
    };
  });
  const { loading: searchLoading, error: searchError } = useSelector(
    (state) => state.flightSchedule || { loading: false, error: null }
  );
  //#endregion Declare Hook

  //#region Declare State
  const [tripType, setTripType] = useState(defaultData.TripType || "oneWay");
  const [departureCity, setDepartureCity] = useState(
    defaultData.DepartureAirportId?.toString() || ""
  );
  const [destinationCity, setDestinationCity] = useState(
    defaultData.ArrivalAirportId?.toString() || ""
  );
  const [departureDate, setDepartureDate] = useState(
    defaultData.DepartureDate || ""
  );
  const [returnDate, setReturnDate] = useState(defaultData.ReturnDate || "");
  const [travellersInfo, setTravellersInfo] = useState({
    displayText: defaultData.Adults
      ? `${defaultData.Adults} & ${defaultData.FlightClass || "Economy"}`
      : "1 & Economy",
    adults: defaultData.Adults ? Math.max(1, defaultData.Adults) : 1,
    children: defaultData.Children || 0,
    seatType: defaultData.FlightClass || "Economy",
  });
  const [ticketPrice, setTicketPrice] = useState(null);
  const isInitialMount = useRef(true); // Để tránh re-render không cần thiết khi mount
  const airportsRef = useRef([]); // Lưu trữ airports cục bộ
  const [localSearchLoading, setLocalSearchLoading] = useState(false); // Thêm state cho loading tìm kiếm
  const [localSearchError, setLocalSearchError] = useState(null); // Thêm state cho error tìm kiếm
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Cập nhật airportsRef ngay khi component mount với dữ liệu hiện tại
      if (airports.length > 0) {
        airportsRef.current = [...airports];
        if (process.env.NODE_ENV === "development") {
          console.log(
            "Initial airportsRef updated with IDs:",
            airportsRef.current.map((a) => ({ id: a.id, name: a.name }))
          );
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn("Initial airports is empty:", airports);
        }
        // Gọi API lần đầu nếu chưa có dữ liệu
        dispatch(getListAirports());
      }
      return; // Bỏ qua lần render đầu tiên
    }

    const formatDefaultDate = (date) => {
      if (!date) return "";
      const parsedDate = new Date(date);
      return isNaN(parsedDate) ? "" : parsedDate.toISOString().split("T")[0];
    };

    setTripType(defaultData.TripType || "oneWay");
    setDepartureCity(defaultData.DepartureAirportId?.toString() || "");
    setDestinationCity(defaultData.ArrivalAirportId?.toString() || "");
    setDepartureDate(formatDefaultDate(defaultData.DepartureDate));
    setReturnDate(formatDefaultDate(defaultData.ReturnDate));

    const newTravellersInfo = {
      displayText: defaultData.Adults
        ? `${defaultData.Adults} & ${defaultData.FlightClass || "Economy"}`
        : "1 & Economy",
      adults: defaultData.Adults ? Math.max(1, defaultData.Adults) : 1,
      children: defaultData.Children || 0,
      seatType: defaultData.FlightClass || "Economy",
    };
    setTravellersInfo(newTravellersInfo);

    // Debug để theo dõi thay đổi airports
    if (process.env.NODE_ENV === "development" && airports.length > 0) {
      console.log(
        "FlightSearchForm airports updated with IDs:",
        airports.map((a) => ({ id: a.id, name: a.name }))
      );
    }
  }, [
    defaultData.TripType,
    defaultData.DepartureAirportId,
    defaultData.ArrivalAirportId,
    defaultData.DepartureDate,
    defaultData.ReturnDate,
    defaultData.Adults,
    defaultData.Children,
    defaultData.FlightClass,
    dispatch, // Theo dõi dispatch để gọi API lần đầu
  ]);

  useEffect(() => {
    if (
      airports.length > 0 &&
      JSON.stringify(airportsRef.current) !== JSON.stringify(airports)
    ) {
      airportsRef.current = [...airports];
      if (process.env.NODE_ENV === "development") {
        console.log(
          "FlightSearchForm airportsRef updated with IDs:",
          airportsRef.current.map((a) => ({ id: a.id, name: a.name }))
        );
      }
    }
  }, [airports]); // Chỉ theo dõi airports để cập nhật ref, giảm re-render

  useEffect(() => {
    const basePrice = 300; // Đồng bộ với SearchResultsPage
    const adultPrice = basePrice * travellersInfo.adults;
    const childPrice = basePrice * 0.7 * travellersInfo.children; // Giá trẻ em là 70% giá người lớn
    const totalPrice = adultPrice + childPrice;
    setTicketPrice(totalPrice);
  }, [travellersInfo]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleTripTypeChange = (type) => {
    const normalizedType = type === "roundTrip" ? "roundTrip" : "oneWay";
    setTripType(normalizedType);
    if (normalizedType === "oneWay") {
      setReturnDate("");
    }
  };

  const handleTravellersChange = useCallback((info) => {
    console.log("Travellers info updated:", info);
    setTravellersInfo(info);
  }, []);

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && dateStr.includes("-");
  };

  const validateForm = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Validating form with:", {
        departureCity,
        destinationCity,
        departureDate,
        returnDate,
        tripType,
        travellersInfo,
        airports: airports.map((a) => ({ id: a.id, name: a.name })),
        airportsRef: airportsRef.current.map((a) => ({
          id: a.id,
          name: a.name,
        })),
      });
    }

    if (airportsLoading) {
      toast.warn("Loading airports, please wait...");
      return false;
    }
    if (airportsError) {
      toast.error(
        `Error loading airports: ${airportsError}, please try again later!`
      );
      return false;
    }
    // Sử dụng airportsRef nếu airports rỗng, đảm bảo dữ liệu không bị mất
    const effectiveAirports =
      airports.length > 0 ? airports : airportsRef.current;
    if (!effectiveAirports || effectiveAirports.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Airports is empty or undefined:",
          airports,
          "Ref:",
          airportsRef.current
        );
      }
      toast.error(
        "The airport list has not been completed, please refresh the page or try again later!"
      );
      return false;
    }

    const departureAirport = effectiveAirports.find(
      (a) => a.id && a.id.toString() === departureCity
    );
    const destinationAirport = effectiveAirports.find(
      (a) => a.id && a.id.toString() === destinationCity
    );
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Departure Airport found:",
        departureAirport,
        "Destination Airport found:",
        destinationAirport
      );
    }

    if (!departureCity || !departureAirport) {
      toast.error("Please choose a valid departure airport!");
      return false;
    }
    if (!destinationCity || !destinationAirport) {
      toast.error("Please choose a valid destination airport!");
      return false;
    }
    if (!departureDate || !isValidDate(departureDate)) {
      toast.error("Please choose a valid departure date!");
      return false;
    }
    if (tripType === "roundTrip" && (!returnDate || !isValidDate(returnDate))) {
      toast.error("Please choose a valid date for a round trip!");
      return false;
    }
    if (
      tripType === "roundTrip" &&
      new Date(returnDate) < new Date(departureDate)
    ) {
      toast.error("The return date must be after the departure date!");
      return false;
    }
    if (travellersInfo.adults + travellersInfo.children <= 0) {
      toast.error("There must be at least 1 passenger!");
      return false;
    }
    return true;
  };

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date)) {
      console.warn("Invalid date:", dateStr);
      return null;
    }
    const offset = 7 * 60; // UTC+7 in minutes
    const localDate = new Date(date.getTime() + offset * 60 * 1000);
    return localDate.toISOString().replace("Z", "+07:00");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLocalSearchLoading(true);
    setLocalSearchError(null);
    const searchParams = {
      DepartureAirportId: parseInt(departureCity) || 0,
      ArrivalAirportId: parseInt(destinationCity) || 0,
      DepartureDate: departureDate ? formatDateForApi(departureDate) : null,
      TripType: tripType || "oneWay",
      Adults: travellersInfo.adults || 1,
      Children: travellersInfo.children || 0,
      FlightClass: travellersInfo.seatType.toLowerCase() || "economy",
      ReturnDate:
        tripType === "roundTrip" && returnDate
          ? formatDateForApi(returnDate)
          : null,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("Final searchParams before sending:", searchParams);
    }

    try {
      await dispatch(searchFlightSchedules(searchParams)).unwrap();
      onSearch(searchParams); // Gọi callback để thông báo tìm kiếm thành công
      navigate("/search-results", { state: { searchParams } }); // Chuyển trang
    } catch (error) {
      setLocalSearchError(error.message || "Search failed");
      toast.error(
        `Search failed: ${error.message || "Please try again later"}`
      );
      console.error("Search error:", error);
    } finally {
      setLocalSearchLoading(false);
    }
  };
  //#endregion Handle Function

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-visible">
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="z-40">
              <CityAutocomplete
                value={departureCity}
                onChange={(value) => {
                  console.log("Updated departureCity:", value);
                  setDepartureCity(value);
                }}
                placeholder="Select Departure City"
                label="Departure City"
              />
            </div>
            <div className="z-30">
              <CityAutocomplete
                value={destinationCity}
                onChange={(value) => {
                  console.log("Updated destinationCity:", value);
                  setDestinationCity(value);
                }}
                placeholder="Select Destination City"
                label="Destination City"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Departure Date</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  console.log(
                    "Selected departure date:",
                    e.target.value,
                    "formatted:",
                    newDate
                  );
                  setDepartureDate(newDate);
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative z-20">
              <TravellersDropdown
                value={travellersInfo}
                onChange={handleTravellersChange}
              />
            </div>
          </div>
          {tripType === "roundTrip" && (
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      console.log(
                        "Selected return date:",
                        e.target.value,
                        "formatted:",
                        newDate
                      );
                      setReturnDate(newDate);
                    }}
                    min={
                      departureDate || new Date().toISOString().split("T")[0]
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-200"
              disabled={localSearchLoading || airportsLoading}
            >
              {localSearchLoading ? "Searching..." : "Search flights"}
            </button>
          </div>
        </form>
        {localSearchError && (
          <p className="text-red-600 text-center mt-2">{localSearchError}</p>
        )}
        {airportsError && (
          <p className="text-red-600 text-center mt-2">{airportsError}</p>
        )}
      </div>
    </div>
  );
};

export default FlightSearchForm;
