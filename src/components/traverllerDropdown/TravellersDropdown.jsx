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
    displayText: "1 Adult, 0 Children & Economy",
  });
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleTravellersChange = (field, value) => {
    let updatedInfo = { ...travellersInfo, [field]: value };
    if (field === "adults" || field === "children") {
      updatedInfo = {
        ...updatedInfo,
        displayText: `${updatedInfo.adults} Adult${
          updatedInfo.adults > 1 ? "s" : ""
        }, ${updatedInfo.children} Child${
          updatedInfo.children > 1 ? "ren" : ""
        } & ${updatedInfo.seatType}`,
      };
    } else if (field === "seatType") {
      updatedInfo = {
        ...updatedInfo,
        displayText: `${updatedInfo.adults} Adult${
          updatedInfo.adults > 1 ? "s" : ""
        }, ${updatedInfo.children} Child${
          updatedInfo.children > 1 ? "ren" : ""
        } & ${value}`,
      };
    }
    setTravellersInfo(updatedInfo);
    onChange(updatedInfo); // Truyền dữ liệu lên parent
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200); // Đóng dropdown sau khi mất focus
  };
  //#endregion Handle Function

  return (
    <div className="relative">
      <label className="block text-gray-700 mb-2">Travellers & Seat</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-gray-300 rounded cursor-pointer"
        onBlur={handleBlur}
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
                handleTravellersChange(
                  "adults",
                  Math.max(1, parseInt(e.target.value) || 1)
                )
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
                handleTravellersChange(
                  "children",
                  Math.max(0, parseInt(e.target.value) || 0)
                )
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
