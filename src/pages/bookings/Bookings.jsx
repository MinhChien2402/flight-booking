// Libs
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
import AccountInfo from "../../components/accountInfo/AccountInfo";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import BookingDetailModal from "../../components/bookingDetailModal/BookingDetailModal";
import BookedTicketsTable from "../../components/bookedTicketTable/BookedTicketTable";
// Others
import { getUserBookings } from "../../thunk/userBookingThunk";
import { getBookingDetail } from "../../thunk/bookingDetailThunk";
// Styles, images, icons

const BookingsPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  // Lấy trạng thái từ userBooking slice
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useSelector((state) => state.userBooking);
  // Lấy trạng thái từ bookingDetail slice
  const {
    bookingDetail,
    loading: detailLoading,
    error: detailError,
  } = useSelector((state) => state.bookingDetail);
  //#endregion Selector

  //#region Declare State
  const [isModalOpen, setIsModalOpen] = useState(false);
  //#endregion Declare State

  //#region Implement Hook
  // Gọi API lấy danh sách booking khi component mount
  useEffect(() => {
    dispatch(getUserBookings())
      .unwrap()
      .then((payload) => {
        console.log("API Response:", payload);
      })
      .catch((error) => {
        console.log("API Error:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    console.log("Booking Detail State:", {
      bookingDetail,
      detailLoading,
      detailError,
      isModalOpen,
    });
    if (isModalOpen && bookingDetail && !detailLoading) {
      console.log("Modal should be visible with data:", bookingDetail);
    } else if (isModalOpen && detailLoading) {
      console.log("Modal delayed due to loading:", detailLoading);
    }
  }, [bookingDetail, detailLoading, detailError, isModalOpen]);
  //#endregion Implement Hook

  //#region Handle Function
  // Xử lý khi bấm vào Airline
  const handleAirlineClick = (bookingId) => {
    if (detailLoading) {
      console.log("Dispatch blocked due to detailLoading:", detailLoading);
      return;
    }
    console.log("Clicked BookingId:", bookingId);
    dispatch(getBookingDetail(bookingId))
      .unwrap()
      .then(() => {
        setIsModalOpen(true);
        console.log("Modal opened, bookingDetail:", bookingDetail);
      })
      .catch((error) => {
        console.error("Failed to fetch booking detail:", error);
        alert(`Không thể lấy chi tiết vé: ${error}`);
      });
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //#endregion Handle Function

  // Ánh xạ dữ liệu bookings sang định dạng mà BookedTicketsTable mong đợi
  const mappedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      BookingId: booking.bookingId,
      Airline: booking.airline,
      From: booking.from,
      To: booking.to,
      Departure: booking.departure,
      Arrival: booking.arrival,
      Duration: booking.duration,
      BookedOn: booking.bookedOn,
      TotalPrice: booking.totalPrice || booking.TotalPrice,
    }));
  }, [bookings]); // Chỉ ánh xạ lại khi bookings thay đổi

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Account Info Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <AccountInfo />
        </div>

        {/* Booked Tickets Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Tickets are booked
          </h2>
          {bookingsLoading && <p className="text-gray-600">loading...</p>}
          {bookingsError && (
            <p className="text-red-600">
              Error when downloading the ticket list: {bookingsError}
            </p>
          )}
          {!bookingsLoading &&
            !bookingsError &&
            (!bookings || bookings.length === 0) && (
              <p className="text-gray-600">
                You do not have any tickets or non -download data.
              </p>
            )}
          {!bookingsLoading &&
            !bookingsError &&
            bookings &&
            bookings.length > 0 && (
              <BookedTicketsTable
                tickets={mappedBookings}
                onAirlineClick={handleAirlineClick}
              />
            )}
        </div>
      </div>
      <Footer />

      {/* Modal hiển thị chi tiết vé */}
      <BookingDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bookingDetail={bookingDetail}
        loading={detailLoading}
        error={detailError}
      />
    </div>
  );
};

export default BookingsPage;
