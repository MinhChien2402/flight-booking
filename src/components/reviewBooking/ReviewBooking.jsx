// Libs
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../footer/Footer";
// Others
import { createBooking } from "../../thunk/bookingThunk";
// Styles, images, icons

const ReviewBooking = () => {
  //#region Declare Hook
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, currentBooking } = useSelector(
    (state) => state.booking
  );
  const flight = location.state || {};
  //#endregion Declare Hook
  //#region Declare State
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState({
    Title: "",
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    PassportNumber: "",
    PassportExpiry: "",
  });
  //#endregion Declare State

  const total = flight.price
    ? parseFloat(flight.price.replace("$", "") || "0").toFixed(2)
    : "0.00";

  useEffect(() => {
    const isValid =
      passengerInfo.Title &&
      passengerInfo.FirstName &&
      passengerInfo.LastName &&
      passengerInfo.DateOfBirth &&
      passengerInfo.PassportNumber &&
      passengerInfo.PassportExpiry;
    setIsFormValid(!!isValid);
  }, [passengerInfo]);

  useEffect(() => {
    if (status === "succeeded" && currentBooking) {
      alert(currentBooking.message);
      navigate("/thank-you", {
        state: { bookingId: currentBooking.bookingId },
      });
    } else if (status === "failed" && error) {
      console.error("Lỗi đặt vé:", error);
      alert("Không thể xác nhận đặt vé: " + error);
    }
  }, [status, currentBooking, error, navigate]);

  //#region Handle Function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassengerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmClick = () => setModalOpen(true);

  const handleCancelModal = () => setModalOpen(false);

  const handleConfirmModal = () => {
    setModalOpen(false);

    console.log("TicketId gửi đi:", flight.id);

    if (!flight.id) {
      alert("Lỗi: Không tìm thấy ID vé. Vui lòng thử lại.");
      return;
    }

    const ticketId = parseInt(flight.id, 10);
    if (isNaN(ticketId)) {
      alert("Lỗi: ID vé không hợp lệ. Vui lòng chọn lại chuyến bay.");
      return;
    }

    const requestBody = {
      ticketId: ticketId,
      totalPrice: parseFloat(total),
      passengers: [passengerInfo],
    };

    console.log("Dữ liệu gửi đi:", JSON.stringify(requestBody, null, 2));
    dispatch(createBooking(requestBody));
  };
  //#region Handle Function

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm the booking</h2>
            <p className="mb-6">
              Are you sure the information you have filled out?
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

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-4 mb-12">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">
          Review Your Booking
        </h1>

        <div className="border p-4 rounded-md mb-2 bg-gray-100">
          <div className="font-semibold text-lg mb-2">
            {flight.airline || "N/A"}
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <div>
              <div className="font-bold">{flight.departTime || "N/A"}</div>
              <div>{flight.departDate || "N/A"}</div>
              <div>{flight.from || "N/A"}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div>{flight.duration || "N/A"}</div>
              <div className="text-xs text-gray-500">
                {flight.stops || "N/A"}
              </div>
              <div>✈️</div>
            </div>
            <div>
              <div className="font-bold">{flight.arriveTime || "N/A"}</div>
              <div>{flight.arriveDate || "N/A"}</div>
              <div>{flight.to || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-right text-lg font-semibold text-gray-800">
          Total: ${total}
        </div>

        <div className="mt-6 border rounded-md p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Adult Information - 1</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Title
              </label>
              <select
                name="Title"
                value={passengerInfo.Title}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              >
                <option value="" disabled>
                  Select Title
                </option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="DateOfBirth"
                value={passengerInfo.DateOfBirth}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                value={passengerInfo.FirstName}
                onChange={handleChange}
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
                name="LastName"
                value={passengerInfo.LastName}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Passport Number
              </label>
              <input
                type="text"
                name="PassportNumber"
                value={passengerInfo.PassportNumber}
                onChange={handleChange}
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
                name="PassportExpiry"
                value={passengerInfo.PassportExpiry}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
        </div>

        {isFormValid && (
          <button
            className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
            onClick={handleConfirmClick}
          >
            Confirm Booking
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReviewBooking;
