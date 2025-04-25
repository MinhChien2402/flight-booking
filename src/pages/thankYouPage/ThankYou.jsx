// Libs
import React from "react";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Others
// Styles, images, icons

const ThankYouPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleViewTicket = () => {
    navigate("/bookings");
  };
  //#endregion Handle Function

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-700 text-center max-w-md mb-8">
          Your order is confirmed. Please keep your ticket for your journey.
        </p>
        <button
          onClick={handleViewTicket}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-md font-semibold"
        >
          View My Ticket
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ThankYouPage;
