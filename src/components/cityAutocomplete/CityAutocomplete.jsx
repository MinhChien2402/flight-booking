// Libs
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Thunks
import { getListAirports } from "../../thunk/airportThunk";

// Others
// Styles, images, icons

// Định nghĩa constant fallback để tránh tạo array mới mỗi lần (fix warning re-render)
const EMPTY_AIRPORTS = [];

const CityAutocomplete = ({
  value: propValue,
  onChange,
  placeholder,
  label,
  disabled = false,
}) => {
  //#region Declare Hook
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Declare State
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  //#endregion Declare State

  // Sử dụng useSelector trực tiếp thay vì createSelector
  const airportsState = useSelector(
    (state) =>
      state.airports || { loading: false, error: null, data: EMPTY_AIRPORTS }
  );
  const airports = airportsState.data || EMPTY_AIRPORTS;
  const loading = airportsState.loading;
  const error = airportsState.error;

  //#region Implement Hook
  useEffect(() => {
    // Fetch airports nếu chưa có
    if (airports.length === 0 && !loading && !error) {
      dispatch(getListAirports());
    }
  }, [airports.length, loading, error, dispatch]);

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

    if (propValue && airports.length > 0) {
      const parsedValue = propValue.toString();
      const selectedAirport = airports.find(
        (airport) => airport.id?.toString() === parsedValue
      );
      if (selectedAirport) {
        const newInputValue = `${selectedAirport.name || "Unknown"} (${
          selectedAirport.code || "N/A"
        })`;
        if (newInputValue !== inputValue) {
          setInputValue(newInputValue);
        }
      } else {
        console.warn("Airport not found for value:", propValue);
        setInputValue(`ID: ${parsedValue} (Not found)`); // Fallback display
      }
    } else if (!propValue && inputValue !== "") {
      setInputValue("");
    } else if (loading) {
      setInputValue("Loading airports..."); // Hiển thị tạm khi loading
    }
  }, [propValue, airports, loading, inputValue]); // Theo dõi để sync dynamic

  const handleInputChange = (e) => {
    if (disabled) return;
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
    if (disabled) return;
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
  if (error) return <div>Error loading airports: {error}</div>;

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => !disabled && setShowDropdown(true)}
        onBlur={handleBlur}
        placeholder={placeholder || "Search city..."}
        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        disabled={disabled || loading} // Disable thêm nếu loading
      />
      {!disabled && !loading && showDropdown && filteredAirports.length > 0 && (
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
      {!disabled &&
        !loading &&
        showDropdown &&
        filteredAirports.length === 0 &&
        inputValue && (
          <p className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 p-2 text-gray-500">
            No airports found.
          </p>
        )}
    </div>
  );
  //#endregion Handle Function
};

export default CityAutocomplete;
