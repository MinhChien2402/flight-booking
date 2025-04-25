// Libs
import React, { useState, useEffect, useRef } from "react";
// Components, Layouts, Pages
// Others
// Styles, images, icons

// Example list of cities - in a real app, you might fetch these from an API
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "San Francisco",
  "Charlotte",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington DC",
  "Boston",
  "El Paso",
  "Detroit",
  "Nashville",
  "Portland",
  "London",
  "Paris",
  "Tokyo",
  "Dubai",
  "Singapore",
  "Hong Kong",
  "Bangkok",
  "Seoul",
  "Rome",
  "Amsterdam",
  "Sydney",
  "Mumbai",
  "Toronto",
  "Berlin",
  "Barcelona",
];

const CityAutocomplete = ({ value, onChange, placeholder, label }) => {
  //#region Declare Hook
  const wrapperRef = useRef(null);
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onChange(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = cities
      .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  //#endregion Handle Function

  return (
    <div className="relative" ref={wrapperRef}>
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.trim() !== "" && setShowSuggestions(true)}
        placeholder={placeholder || "Select City"}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;
