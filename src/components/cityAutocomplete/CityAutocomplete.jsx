// Libs
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// Thunks
import { getListAirports } from "../../thunk/airportThunk";

// Others
// Styles, images, icons

const CityAutocomplete = ({
  value: propValue,
  onChange,
  placeholder,
  label,
}) => {
  //#region Declare Hook
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const {
    data: airports = [],
    loading,
    error,
  } = useSelector(
    (state) => state.airport || { data: [], loading: false, error: null }
  );
  //#endregion Selector

  //#region Declare State
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true); // Để kiểm soát khởi tạo lần đầu
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    console.log(
      "CityAutocomplete useEffect - propValue:",
      propValue,
      "data length:",
      airports.length,
      "loading:",
      loading,
      "error:",
      error,
      "airports data:",
      airports.map((a) => ({ id: a.id, name: a.name }))
    );
    // Fetch airports nếu chưa có dữ liệu
    if (airports.length === 0 && !loading && !error) {
      dispatch(getListAirports());
    }

    // Chỉ xử lý propValue khi airports có dữ liệu và là lần tải đầu tiên
    if (initialLoad && propValue && airports.length > 0) {
      const parsedValue = propValue ? propValue.toString() : "";
      if (parsedValue && !isNaN(parseInt(parsedValue))) {
        const selectedAirport = airports.find(
          (airport) => airport.id && airport.id.toString() === parsedValue
        );
        if (selectedAirport) {
          const newInputValue = `${selectedAirport.name || "Unknown"} (${
            selectedAirport.code || "N/A"
          })`;
          setInputValue(newInputValue);
        } else {
          console.warn(
            "Airport not found for value:",
            propValue,
            "in data:",
            airports
          );
          setInputValue("");
        }
      } else {
        setInputValue("");
      }
      setInitialLoad(false); // Đánh dấu đã hoàn tất khởi tạo
    }
  }, [propValue, airports, loading, error, dispatch, initialLoad]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    setShowDropdown(true);

    if (query && airports.length > 0) {
      const filtered = airports.filter(
        (airport) =>
          (airport.name || "").toLowerCase().includes(query.toLowerCase()) ||
          (airport.code || "").toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAirports(filtered);
    } else {
      setFilteredAirports([]);
      if (!query) setShowDropdown(false);
    }
  };

  const handleSelectAirport = (airport) => {
    if (!airport || !airport.id) {
      console.warn("Invalid airport data:", airport);
      return;
    }
    const displayValue = `${airport.name || "Unknown"} (${
      airport.code || "N/A"
    })`;
    const airportId = airport.id.toString();
    console.log("Selected airport:", { displayValue, airportId });
    setInputValue(displayValue);
    onChange(airportId); // Truyền id lên parent
    setShowDropdown(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200); // Đóng dropdown sau khi mất focus
  };
  //#endregion Implement Hook

  //#region Handle Function
  if (loading) return <div>Loading airports...</div>;
  if (error) return <div>Error loading airports: {error.message || error}</div>;

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={handleBlur}
        placeholder={placeholder || "Search city..."}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && filteredAirports.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
          {filteredAirports.map((airport) => (
            <li
              key={airport.id}
              onClick={() => handleSelectAirport(airport)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {airport.name || "Unknown"} ({airport.code || "N/A"})
            </li>
          ))}
        </ul>
      )}
      {showDropdown && filteredAirports.length === 0 && inputValue && (
        <p className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 p-2 text-gray-500">
          No airports found.
        </p>
      )}
    </div>
  );
  //#endregion Handle Function
};

export default CityAutocomplete;
