// Libs
// Components, Layouts, Pages
// Others
// Styles, images, icons
import React from "react";

const Button = ({ children, primary, className, ...props }) => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function

  return (
    <button
      className={`px-4 py-2 rounded font-medium transition-colors ${
        primary
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-white text-gray-700 hover:bg-gray-100"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
