// Libs
import React, { useState, useEffect, useRef } from "react";

// Components, Layouts, Pages
// Others
// Styles, images, icons

const seatTypes = ["Economy", "Business", "First"]; // Thứ tự hợp lý: Economy đầu tiên

const TravellersDropdown = ({ value, onChange, className }) => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [isOpen, setIsOpen] = useState(false);
  const [localInfo, setLocalInfo] = useState({
    adults: value?.adults || 1,
    children: value?.children || 0,
    infants: value?.infants || 0,
    seatType: value?.seatType || "Economy",
    displayText: value?.displayText || "1 & Economy",
  });
  const dropdownRef = useRef(null); // Ref cho toàn bộ dropdown
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    // Cập nhật localInfo khi value từ parent thay đổi
    setLocalInfo({
      adults: value?.adults || 1,
      children: value?.children || 0,
      infants: value?.infants || 0,
      seatType: value?.seatType || "Economy",
      displayText: value?.displayText || "1 & Economy",
    });
  }, [value]);

  // Xử lý click outside để đóng dropdown
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
  //#endregion Implement Hook

  //#region Handle Function
  const handleCountChange = (type, delta) => {
    setLocalInfo((prev) => {
      let newCount = prev[type] + delta;
      if (newCount < (type === "adults" ? 1 : 0)) return prev; // Adults min 1, others min 0
      if (newCount > 9) return prev; // Max 9 cho mỗi loại (tùy chỉnh nếu cần)
      if (type === "infants" && newCount > prev.adults) return prev; // Infants <= adults

      const updated = { ...prev, [type]: newCount };
      const total = updated.adults + updated.children; // Tổng không tính infants
      updated.displayText = `${total} & ${updated.seatType}`;

      onChange(updated); // Truyền ngay lên parent
      return updated;
    });
  };

  const handleSeatChange = (seatType) => {
    setLocalInfo((prev) => {
      const updated = { ...prev, seatType };
      const total = updated.adults + updated.children;
      updated.displayText = `${total} & ${updated.seatType}`;

      onChange(updated); // Truyền ngay lên parent
      return updated;
    });
  };
  //#endregion Handle Function

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
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 p-4 shadow-lg">
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
                  onClick={() => handleSeatChange(type)} // Chọn trực tiếp bằng click
                  className={`p-2 border rounded cursor-pointer text-center ${
                    localInfo.seatType === type
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  } hover:bg-blue-200`}
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
