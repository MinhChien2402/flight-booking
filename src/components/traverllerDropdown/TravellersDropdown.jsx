// Libs
import React, { useState } from "react";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const TravellersDropdown = ({ onChange }) => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector
  //#region Declare State
  const [isOpen, setIsOpen] = useState(false);
  const [travellersInfo, setTravellersInfo] = useState({
    adults: 1,
    children: 0,
    seatType: "Economy",
    displayText: "1 & Economy",
  });
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook
  //#region Handle Function
  const handleTravellersChange = (field, value) => {
    const updatedInfo = { ...travellersInfo, [field]: value };
    if (field === "adults" || field === "children") {
      updatedInfo.displayText = `${updatedInfo.adults} Adults, ${updatedInfo.children} Children, ${updatedInfo.seatType}`;
    } else if (field === "seatType") {
      updatedInfo.displayText = `${updatedInfo.adults} Adults, ${updatedInfo.children} Children, ${updatedInfo.seatType}`;
    }
    setTravellersInfo(updatedInfo);
    onChange(updatedInfo);
  };
  //#endregion Handle Function

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">Travellers & Seat</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-gray-300 rounded cursor-pointer"
      >
        {travellersInfo.displayText}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 p-4">
          <div className="mb-2">
            <label className="block text-gray-700">Adults</label>
            <input
              type="number"
              min="1"
              value={travellersInfo.adults}
              onChange={(e) =>
                handleTravellersChange("adults", parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Children</label>
            <input
              type="number"
              min="0"
              value={travellersInfo.children}
              onChange={(e) =>
                handleTravellersChange("children", parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Seat Type</label>
            <select
              value={travellersInfo.seatType}
              onChange={(e) =>
                handleTravellersChange("seatType", e.target.value)
              }
              className="w-full p-2 border rounded"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravellersDropdown;
