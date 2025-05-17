// Libs
import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import TravellersDropdown from "../traverllerDropdown/TravellersDropdown";
import CityAutocomplete from "../cityAutocomplete/CityAutocomplete";
// Others
// Styles, images, icons

const FlightSearchForm = ({ onSearch = () => {}, defaultData = {} }) => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const airports = useSelector((state) => state.airports?.data || []);
  //#endregion Selector
  //#region Declare State
  const [tripType, setTripType] = useState(defaultData.tripType || "oneWay");
  const [departureCity, setDepartureCity] = useState(
    defaultData.departureAirportId?.toString() || ""
  );
  const [destinationCity, setDestinationCity] = useState(
    defaultData.arrivalAirportId?.toString() || ""
  );
  const [departureDate, setDepartureDate] = useState(
    defaultData.departureDate || ""
  );
  const [returnDate, setReturnDate] = useState(defaultData.returnDate || "");
  const [travellersInfo, setTravellersInfo] = useState({
    displayText: defaultData.travellers
      ? `${defaultData.travellers} & ${defaultData.flightClass || "Economy"}`
      : "1 & Economy",
    adults: defaultData.travellers ? Math.max(1, defaultData.travellers) : 1,
    children: 0,
    seatType: defaultData.flightClass || "Economy",
  });
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    const formatDefaultDate = (date) => {
      if (!date) return "";
      const parsedDate = new Date(date);
      return isNaN(parsedDate) ? "" : parsedDate.toISOString().split("T")[0];
    };

    // Chỉ đồng bộ khi state ban đầu trống
    if (!departureCity && defaultData.departureAirportId?.toString()) {
      setDepartureCity(defaultData.departureAirportId?.toString() || "");
    }
    if (!destinationCity && defaultData.arrivalAirportId?.toString()) {
      setDestinationCity(defaultData.arrivalAirportId?.toString() || "");
    }
    if (!departureDate && defaultData.departureDate) {
      const formattedDepartureDate = formatDefaultDate(
        defaultData.departureDate
      );
      setDepartureDate(formattedDepartureDate);
    }
    if (!returnDate && defaultData.returnDate) {
      const formattedReturnDate = formatDefaultDate(defaultData.returnDate);
      setReturnDate(formattedReturnDate);
    }

    const newTravellersInfo = {
      displayText: defaultData.travellers
        ? `${defaultData.travellers} & ${defaultData.flightClass || "Economy"}`
        : "1 & Economy",
      adults: defaultData.travellers ? Math.max(1, defaultData.travellers) : 1,
      children: 0,
      seatType: defaultData.flightClass || "Economy",
    };

    if (
      travellersInfo.displayText !== newTravellersInfo.displayText ||
      travellersInfo.adults !== newTravellersInfo.adults ||
      travellersInfo.children !== newTravellersInfo.children ||
      travellersInfo.seatType !== newTravellersInfo.seatType
    ) {
      setTravellersInfo(newTravellersInfo);
    }
  }, [defaultData]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "oneWay") {
      setReturnDate("");
    }
  };

  const handleTravellersChange = useCallback((info) => {
    setTravellersInfo(info);
  }, []);

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && dateStr.includes("-");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) {
      console.warn("Invalid date:", dateStr);
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const validateForm = () => {
    console.log("Validating form with:", {
      departureCity,
      destinationCity,
      departureDate,
      returnDate,
      tripType,
      travellersInfo,
      airports,
    });

    if (airports.length === 0) {
      toast.error("Danh sách sân bay chưa tải xong, vui lòng thử lại!");
      return false;
    }

    if (
      !departureCity ||
      !airports.some((a) => a.id.toString() === departureCity)
    ) {
      toast.error("Vui lòng chọn sân bay khởi hành hợp lệ!");
      return false;
    }
    if (
      !destinationCity ||
      !airports.some((a) => a.id.toString() === destinationCity)
    ) {
      toast.error("Vui lòng chọn sân bay điểm đến hợp lệ!");
      return false;
    }
    if (!departureDate || !isValidDate(departureDate)) {
      toast.error("Vui lòng chọn ngày khởi hành hợp lệ!");
      return false;
    }
    if (tripType === "roundTrip" && (!returnDate || !isValidDate(returnDate))) {
      toast.error("Vui lòng chọn ngày về hợp lệ cho chuyến khứ hồi!");
      return false;
    }
    if (
      tripType === "roundTrip" &&
      new Date(returnDate) < new Date(departureDate)
    ) {
      toast.error("Ngày về phải sau ngày khởi hành!");
      return false;
    }
    if (travellersInfo.adults + travellersInfo.children <= 0) {
      toast.error("Phải có ít nhất 1 hành khách!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting form with:", {
      departureCity,
      destinationCity,
      departureDate,
      returnDate,
      tripType,
      travellersInfo,
    });
    if (!validateForm()) return;

    try {
      const searchParams = {
        departureAirportId: parseInt(departureCity),
        arrivalAirportId: parseInt(destinationCity),
        departureDate,
        tripType,
        travellers: travellersInfo.adults + travellersInfo.children,
        flightClass: travellersInfo.seatType,
        returnDate: tripType === "roundTrip" ? returnDate : null,
      };
      console.log("Submitting search with params:", searchParams);
      await onSearch(searchParams);
      navigate("/search-results", { state: searchParams });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Lỗi khi tìm kiếm: " + (error.message || "Đã có lỗi xảy ra"));
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
                  const newDate = formatDate(e.target.value);
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
              <TravellersDropdown onChange={handleTravellersChange} />
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
                      const newDate = formatDate(e.target.value);
                      console.log(
                        "Selected return date:",
                        e.target.value,
                        "formatted:",
                        newDate
                      );
                      setReturnDate(newDate); // Sửa lỗi: dùng setReturnDate thay vì setDepartureDate
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
