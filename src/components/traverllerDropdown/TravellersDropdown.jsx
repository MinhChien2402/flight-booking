// Libs
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const TravellersDropdown = ({ onChange }) => {
  //#region Declare Hook
  const seatTypes = ["Economy", "Premium Economy", "Business", "First"];
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [seatType, setSeatType] = useState("Economy");
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const totalPassengers = adults + children;
    onChange?.({
      displayText: `${totalPassengers} & ${seatType}`,
      adults,
      children,
      seatType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adults, children, seatType]);
  //#endregion Implement Hook

  //#region Handle Function
  const increment = (setter, value) => {
    setter(value + 1);
  };

  const decrement = (setter, value) => {
    if (value > 0) {
      setter(value - 1);
    }
  };

  // Stop event propagation to prevent dropdown from closing
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  //#endregion Handle Function

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="space-y-2">
        <label className="block text-gray-700">Travellers & Seat</label>
        <div
          ref={containerRef}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {adults + children} & {seatType}
          </span>
          <ChevronDown size={20} />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          onClick={handleContentClick}
        >
          <div className="p-4">
            {/* Adults */}
            <div className="mb-4">
              <div className="font-medium text-gray-700 mb-2">Adults</div>
              <div className="flex items-center">
                <button
                  className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded text-xl"
                  onClick={() => decrement(setAdults, adults)}
                  disabled={adults <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="mx-2 w-full text-center border border-gray-300 rounded p-1"
                  value={adults}
                  readOnly
                />
                <button
                  className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded text-xl"
                  onClick={() => increment(setAdults, adults)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="mb-4">
              <div className="font-medium text-gray-700 mb-2">Children</div>
              <div className="flex items-center">
                <button
                  className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded text-xl"
                  onClick={() => decrement(setChildren, children)}
                  disabled={children <= 0}
                >
                  -
                </button>
                <input
                  type="text"
                  className="mx-2 w-full text-center border border-gray-300 rounded p-1"
                  value={children}
                  readOnly
                />
                <button
                  className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded text-xl"
                  onClick={() => increment(setChildren, children)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Seat Type */}
            <div>
              <div className="font-medium text-gray-700 mb-2">
                Select Seat Type
              </div>
              <select
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                {seatTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravellersDropdown;
