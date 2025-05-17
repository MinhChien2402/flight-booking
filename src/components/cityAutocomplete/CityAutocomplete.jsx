// Libs
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const CityAutocomplete = ({
  value: propValue,
  onChange,
  placeholder,
  label,
}) => {
  const {
    data = [],
    loading,
    error,
  } = useSelector(
    (state) => state.airports || { data: [], loading: false, error: null }
  );
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Đồng bộ giá trị ban đầu từ props (defaultData)
  useEffect(() => {
    console.log(
      "CityAutocomplete useEffect - propValue:",
      propValue,
      "data:",
      data
    );
    if (propValue && data.length > 0 && !inputValue) {
      // Chỉ đồng bộ khi inputValue trống
      const parsedValue = parseInt(propValue);
      if (!isNaN(parsedValue)) {
        const selectedAirport = data.find(
          (airport) => parseInt(airport.id) === parsedValue
        );
        if (selectedAirport) {
          const newInputValue = `${selectedAirport.name || "Unknown"} (${
            selectedAirport.code || "N/A"
          })`;
          console.log("Setting inputValue from useEffect:", newInputValue);
          setInputValue(newInputValue);
        } else {
          console.warn(
            "Airport not found for value:",
            propValue,
            "in data:",
            data
          );
          setInputValue("");
        }
      } else {
        setInputValue("");
      }
    }
  }, [propValue, data]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    setShowDropdown(true);

    if (query && data.length > 0) {
      const filtered = data.filter((airport) =>
        (airport.name || "").toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAirports(filtered);
    } else {
      setFilteredAirports([]);
      if (!query) setShowDropdown(false);
    }
  };

  const handleSelectAirport = (airport) => {
    const displayValue = `${airport.name || "Unknown"} (${
      airport.code || "N/A"
    })`;
    const airportId = airport.id.toString();
    console.log("Selected airport:", { displayValue, airportId });
    setInputValue(displayValue); // Giữ giá trị hiển thị
    onChange(airportId); // Truyền id lên parent
    setShowDropdown(false);
  };

  if (error) {
    return <p className="text-red-500">Error loading airports: {error}</p>;
  }

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder={loading ? "Loading airports..." : placeholder}
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
          {data.length === 0 ? "Loading airports..." : "No airports found."}
        </p>
      )}
    </div>
  );
};

export default CityAutocomplete;
