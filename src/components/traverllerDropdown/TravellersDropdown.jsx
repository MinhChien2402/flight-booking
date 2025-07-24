// Libs
import React, { useState, useEffect, useRef } from "react";

// Components, Layouts, Pages
// Others
// Styles, images, icons

const seatTypes = ["All", "Economy", "Business", "First"];

const TravellersDropdown = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localInfo, setLocalInfo] = useState({
    adults: value?.adults || 1,
    children: value?.children || 0,
    infants: value?.infants || 0,
    seatType: value?.seatType || "Economy",
    displayText: value?.displayText || "1 & Economy",
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLocalInfo({
      adults: value?.adults || 1,
      children: value?.children || 0,
      infants: value?.infants || 0,
      seatType: value?.seatType || "Economy",
      displayText: value?.displayText || "1 & Economy",
    });
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCountChange = (type, delta) => {
    setLocalInfo((prev) => {
      let newCount = prev[type] + delta;
      if (newCount < (type === "adults" ? 1 : 0)) return prev;
      if (newCount > 9) return prev;
      if (type === "infants" && newCount > prev.adults) return prev;

      const updated = { ...prev, [type]: newCount };
      const total = updated.adults + updated.children;
      updated.displayText = `${total} & ${updated.seatType}`;

      onChange(updated);
      return updated;
    });
  };

  const handleSeatChange = (seatType) => {
    setLocalInfo((prev) => {
      const updated = { ...prev, seatType };
      const total = updated.adults + updated.children;
      updated.displayText = `${total} & ${updated.seatType}`;

      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-700 mb-2">Travellers & Seat</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2 border border-gray-300 rounded cursor-pointer ${
          className || ""
        }`}
        tabIndex={0}
      >
        {localInfo.displayText}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 p-4 shadow-lg overflow-y-auto max-h-72">
          {" "}
          {/* Giữ overflow-y-auto max-h-72 để scroll */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Adults</label>
            <div className="flex items-center justify-between border border-gray-300 rounded p-2">
              <button
                type="button"
                onClick={() => handleCountChange("adults", -1)}
                className="text-xl font-bold text-gray-700 hover:text-black"
              >
                -
              </button>
              <span className="text-lg">{localInfo.adults}</span>
              <button
                type="button"
                onClick={() => handleCountChange("adults", 1)}
                className="text-xl font-bold text-gray-700 hover:text-black"
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Children</label>
            <div className="flex items-center justify-between border border-gray-300 rounded p-2">
              <button
                type="button"
                onClick={() => handleCountChange("children", -1)}
                className="text-xl font-bold text-gray-700 hover:text-black"
              >
                -
              </button>
              <span className="text-lg">{localInfo.children}</span>
              <button
                type="button"
                onClick={() => handleCountChange("children", 1)}
                className="text-xl font-bold text-gray-700 hover:text-black"
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Infants</label>
            <div className="flex items-center justify-between border border-gray-300 rounded p-2">
              <button
                type="button"
                onClick={() => handleCountChange("infants", -1)}
                className="text-xl font-bold text-gray-700 hover:text-black"
              >
                -
              </button>
              <span className="text-lg">{localInfo.infants}</span>
              <button
                type="button"
                onClick={() => handleCountChange("infants", 1)}
                className="text-xl font-bold text-gray-700 hover:text-black"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Seat Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {seatTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => handleSeatChange(type)}
                  className={`p-3 border rounded cursor-pointer text-center ${
                    localInfo.seatType === type
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  } hover:bg-blue-200 transition-colors`}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravellersDropdown;
