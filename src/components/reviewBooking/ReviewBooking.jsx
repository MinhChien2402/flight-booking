// Libs
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../footer/Footer";
// Others
// Styles, images, icons

const ReviewBooking = () => {
  //#region Declare Hook
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state;
  //#endregion Declare Hook

  //#region Declare State
  const [isModalOpen, setModalOpen] = useState(false);
  //#endregion Declare State

  //#region Handle Function
  const total = parseFloat(flight.price.replace("$", "")).toFixed(2);

  const handleConfirmClick = () => setModalOpen(true);

  const handleCancelModal = () => setModalOpen(false);

  const handleConfirmModal = () => {
    setModalOpen(false);
    navigate("/thank-you");
  };
  //#endregion Handle Function

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Xác nhận đặt vé</h2>
            <p className="mb-6">
              Bạn đã chắc chắn với những thông tin bạn đã điền?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-800 py-1 px-4 rounded"
                onClick={handleCancelModal}
              >
                Cancel
              </button>
              <button
                className="bg-pink-600 text-white py-1 px-4 rounded"
                onClick={handleConfirmModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-4 mb-12">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">
          Review Your Booking
        </h1>

        {/* Thông tin chuyến bay */}
        <div className="border p-4 rounded-md mb-2 bg-gray-100">
          <div className="font-semibold text-lg mb-2">{flight.airline}</div>
          <div className="flex justify-between text-sm text-gray-700">
            <div>
              <div className="font-bold">{flight.departTime}</div>
              <div>{flight.departDate}</div>
              <div>{flight.from}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div>{flight.duration}</div>
              <div className="text-xs text-gray-500">{flight.stops}</div>
              <div>✈️</div>
            </div>
            <div>
              <div className="font-bold">{flight.arriveTime}</div>
              <div>{flight.arriveDate}</div>
              <div>{flight.to}</div>
            </div>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="mt-4 text-right text-lg font-semibold text-gray-800">
          Total: ${total}
        </div>

        {/* Form thông tin hành khách */}
        <div className="mt-6 border rounded-md p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Adult Information - 1</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title & DOB */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Title
              </label>
              <select
                className="border p-2 rounded w-full"
                required
                defaultValue=""
              >
                <option value="" disabled hidden>
                  Select Title
                </option>
                <option>Mr</option>
                <option>Ms</option>
                <option>Mrs</option>
                <option>Miss</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            {/* First & Last Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            {/* Passport Info */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Passport Number
              </label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Passport Expiry
              </label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Nút xác nhận */}
        <button
          className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
          onClick={handleConfirmClick}
        >
          Confirm Booking
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewBooking;
