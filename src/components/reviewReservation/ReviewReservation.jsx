// Libs
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

// Components
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Button from "../button/Button";

// Others
import { createReservation } from "../../thunk/reservationThunk";

// Icons
import { BiArrowBack } from "react-icons/bi";

const ReviewReservation = () => {
  //#region Declare Hook
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, currentReservation } = useSelector(
    (state) => state.reservation
  );

  // Lấy token từ localStorage hoặc context (giả sử token được lưu sau khi đăng nhập)
  const token = localStorage.getItem("token"); // Giả sử token được lưu dưới key "token"
  let userId = 1; // Mặc định nếu không lấy được

  // Giải mã token để lấy userId
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId =
        parseInt(
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ]
        ) || 1;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Lấy dữ liệu từ state, hỗ trợ cả one-way và round-trip
  const { outboundFlight, returnFlight, searchParams } = location.state || {
    outboundFlight: null,
    returnFlight: null,
    searchParams: {},
  };
  //#endregion Declare Hook

  //#region Declare State
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState(() => {
    const adults = parseInt(searchParams.Adults) || 1;
    const children = parseInt(searchParams.Children) || 0;
    const infants = parseInt(searchParams.Infants) || 0;
    const passengers = [];
    for (let i = 0; i < adults; i++) {
      passengers.push({
        type: "Adult",
        index: i + 1,
        Title: "",
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        PassportNumber: "",
        PassportExpiry: "",
      });
    }
    for (let i = 0; i < children; i++) {
      passengers.push({
        type: "Child",
        index: i + 1,
        Title: "",
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        PassportNumber: "",
        PassportExpiry: "",
      });
    }
    for (let i = 0; i < infants; i++) {
      passengers.push({
        type: "Infant",
        index: i + 1,
        Title: "",
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        PassportNumber: "",
        PassportExpiry: "",
      });
    }
    return passengers;
  });

  // Lấy ngày hiện tại
  const today = new Date().toISOString().split("T")[0];

  // Hàm tính tuổi từ DOB
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Tính total từ outbound và return flight (nếu có)
  const outboundPrice = outboundFlight?.price
    ? parseFloat(outboundFlight.price.replace("$", "") || "0")
    : 0;
  const returnPrice = returnFlight?.price
    ? parseFloat(returnFlight.price.replace("$", "") || "0")
    : 0;
  const total = (outboundPrice + returnPrice).toFixed(2);

  useEffect(() => {
    const isValid = passengerInfo.every((passenger) => {
      // Kiểm tra các trường cơ bản và passport cho tất cả
      if (
        !passenger.Title ||
        !passenger.FirstName ||
        !passenger.LastName ||
        !passenger.DateOfBirth ||
        !passenger.PassportNumber ||
        !passenger.PassportExpiry
      ) {
        return false;
      }

      // Validate DOB dựa trên loại
      const age = calculateAge(passenger.DateOfBirth);
      if (passenger.type === "Adult" && age < 12) return false;
      if (passenger.type === "Child" && (age < 2 || age >= 12)) return false;
      if (passenger.type === "Infant" && age >= 2) return false;

      return true;
    });
    setIsFormValid(isValid);
  }, [passengerInfo]);

  useEffect(() => {
    if (status === "succeeded" && currentReservation) {
      toast.success(
        currentReservation.message || "Reservation confirmed successfully!"
      );
      navigate("/thank-you", {
        state: {
          reservationId: currentReservation.Id || currentReservation.id, // Đảm bảo lấy đúng ID
          outboundFlight,
          returnFlight,
        },
      });
    } else if (status === "failed" && error) {
      console.error("Lỗi đặt vé:", error);
      toast.error("Không thể xác nhận đặt chỗ: " + (error.message || error));
    }
  }, [
    status,
    currentReservation,
    error,
    navigate,
    outboundFlight,
    returnFlight,
  ]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setPassengerInfo((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [name]: value } : passenger
      )
    );
  };

  const handleConfirmClick = () => {
    if (!isFormValid) {
      toast.warning(
        "Vui lòng kiểm tra thông tin hành khách, đặc biệt là ngày sinh không hợp lệ với loại hành khách hoặc các trường bắt buộc chưa điền."
      );
      return;
    }
    setModalOpen(true);
  };

  const handleCancelModal = () => setModalOpen(false);

  const handleConfirmModal = () => {
    setModalOpen(false);
    if (!outboundFlight?.id || outboundFlight.id === "unknown") {
      toast.error("Error: No outbound ticket id. Please try again.");
      return;
    }
    if (
      searchParams.TripType === "roundTrip" &&
      (!returnFlight?.id || returnFlight.id === "unknown")
    ) {
      toast.error("Error: No return ticket id. Please try again.");
      return;
    }

    const outboundTicketId = parseInt(outboundFlight.id, 10);
    const returnTicketId = returnFlight ? parseInt(returnFlight.id, 10) : null;
    if (isNaN(outboundTicketId)) {
      toast.error(
        "Error: Outbound ticket ID is invalid. Please select the flight again."
      );
      return;
    }
    if (returnFlight && isNaN(returnTicketId)) {
      toast.error(
        "Error: Return ticket ID is invalid. Please select the flight again."
      );
      return;
    }

    const requestBody = {
      userId: userId, // Sử dụng userId từ token
      outboundTicketId: outboundTicketId,
      returnTicketId: returnTicketId,
      totalPrice: parseFloat(total), // Chuyển sang decimal khi gửi
      passengers: passengerInfo.map((passenger) => ({
        title: passenger.Title,
        firstName: passenger.FirstName,
        lastName: passenger.LastName,
        dateOfBirth: passenger.DateOfBirth,
        passportNumber: passenger.PassportNumber,
        passportExpiry: passenger.PassportExpiry,
      })),
      confirmationNumber: `CONF${Math.floor(Math.random() * 1000000)}`.padStart(
        10,
        "0"
      ), // Định dạng mã xác nhận
      reservationStatus: "Confirmed",
      cancellationRules:
        "Default: 90% refund if cancelled > 7 days, 50% if < 7 days",
    };

    console.log("Request Body sent to API:", requestBody);
    dispatch(createReservation(requestBody)).then((action) => {
      if (action.payload?.reservationId) {
        toast.success("Reservation confirmed successfully!");
        navigate("/thank-you", {
          state: {
            reservationId: action.payload.reservationId,
            outboundFlight,
            returnFlight,
          },
        });
      } else if (action.error) {
        toast.error(`Failed to confirm reservation: ${action.error.message}`);
      }
    });
  };
  //#endregion Handle Function

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[190px] mt-3"
        onClick={() => navigate(-1)}
      >
        <BiArrowBack size={20} />
      </Button>

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
          Review Your Reservation
        </h1>

        <div className="border p-4 rounded-md mb-2 bg-gray-100">
          <div className="font-semibold text-lg mb-2">
            {outboundFlight?.airline || "N/A"}
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <div>
              <div className="font-bold">
                {outboundFlight?.departTime || "N/A"}
              </div>
              <div>{outboundFlight?.departDate || "N/A"}</div>
              <div>{outboundFlight?.from || "N/A"}</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div>{outboundFlight?.duration || "N/A"}</div>
              <div className="text-xs text-gray-500">
                {outboundFlight?.stops || "N/A"}
              </div>
              <div>✈️</div>
            </div>
            <div>
              <div className="font-bold">
                {outboundFlight?.arriveTime || "N/A"}
              </div>
              <div>{outboundFlight?.arriveDate || "N/A"}</div>
              <div>{outboundFlight?.to || "N/A"}</div>
            </div>
          </div>
        </div>

        {returnFlight && (
          <div className="border p-4 rounded-md mt-4 mb-2 bg-gray-100">
            <div className="font-semibold text-lg mb-2">
              {returnFlight?.airline || "N/A"}
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <div>
                <div className="font-bold">
                  {returnFlight?.departTime || "N/A"}
                </div>
                <div>{returnFlight?.departDate || "N/A"}</div>
                <div>{returnFlight?.from || "N/A"}</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div>{returnFlight?.duration || "N/A"}</div>
                <div className="text-xs text-gray-500">
                  {returnFlight?.stops || "N/A"}
                </div>
                <div>✈️</div>
              </div>
              <div>
                <div className="font-bold">
                  {returnFlight?.arriveTime || "N/A"}
                </div>
                <div>{returnFlight?.arriveDate || "N/A"}</div>
                <div>{returnFlight?.to || "N/A"}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-right text-lg font-semibold text-gray-800">
          Total: ${total}
        </div>

        {passengerInfo.map((passenger, index) => (
          <div key={index} className="mt-6 border rounded-md p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">
              {passenger.type} Information - {passenger.index}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Title
                </label>
                <select
                  name="Title"
                  value={passenger.Title}
                  onChange={(e) => handleChange(index, e)}
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
                  value={passenger.DateOfBirth}
                  onChange={(e) => handleChange(index, e)}
                  max={today}
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
                  value={passenger.FirstName}
                  onChange={(e) => handleChange(index, e)}
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
                  value={passenger.LastName}
                  onChange={(e) => handleChange(index, e)}
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
                  value={passenger.PassportNumber}
                  onChange={(e) => handleChange(index, e)}
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
                  value={passenger.PassportExpiry}
                  onChange={(e) => handleChange(index, e)}
                  min={today} // Đảm bảo expiry không quá khứ
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {isFormValid && (
          <button
            className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
            onClick={handleConfirmClick}
          >
            Confirm Reservation
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReviewReservation;
