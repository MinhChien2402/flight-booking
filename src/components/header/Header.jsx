// Libs
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const Header = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const location = useLocation();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate(-1);
    }
  };
  //#endregion Handle Function

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white border-b border-gray-300">
      <div
        className="text-2xl font-bold cursor-pointer select-none"
        onClick={handleLogoClick}
      >
        <span className="text-gray-700">TRAVEL</span>
        <span className="text-blue-500">BUDDY</span>
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn && userRole === "customer" && (
          <button
            onClick={() => navigate("/bookings")}
            className="text-black hover:text-blue-700 transition-colors"
          >
            Booking
          </button>
        )}

        {isLoggedIn && userRole === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="text-black hover:text-blue-700 font-medium"
          >
            Admin Panel
          </button>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded font-medium hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
