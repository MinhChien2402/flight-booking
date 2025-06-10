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
import Button from "../../components/button/Button";
// Styles, images, icons
import { BiArrowBack, BiDownload } from "react-icons/bi";
import axiosInstance from "../../api/axiosInstance";
import { downloadBookingPdf } from "../../thunk/pdfThunk";

const BookingsPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useSelector((state) => state.userBooking);

  const {
    bookingDetail,
    loading: detailLoading,
    error: detailError,
  } = useSelector((state) => state.bookingDetail);

  const {
    loading: pdfLoading,
    error: pdfError,
    success: pdfSuccess,
  } = useSelector((state) => state.pdf);
  //#endregion Selector

  //#region Declare State
  const [isModalOpen, setIsModalOpen] = useState(false);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getUserBookings())
      .unwrap()
      .then((payload) => {
        console.log("API Response:", payload); // Kiểm tra số lượng bookings và tickets
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
  const handleAirlineClick = (bookingId) => {
    if (detailLoading) {
      return;
    }
    dispatch(getBookingDetail(bookingId))
      .unwrap()
      .then(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        alert(`Cannot retrieve ticket details: ${error}`);
      });
  };

  const handleDownloadPdf = (bookingId) => {
    if (pdfLoading) {
      return;
    }
    dispatch(downloadBookingPdf(bookingId))
      .unwrap()
      .then(() => {
        if (pdfError) {
          alert(`Error downloading PDF: ${pdfError}`);
        } else if (pdfSuccess) {
          console.log(`PDF downloaded successfully for booking ${bookingId}`);
        }
      })
      .catch((error) => {
        alert(`Error downloading PDF: ${error}`);
      });
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //#endregion Handle Function

  const mappedBookings = useMemo(() => {
    console.log("Raw bookings:", bookings); // Debug dữ liệu thô
    if (!Array.isArray(bookings)) return [];
    const result = bookings.flatMap((booking) =>
      (booking.tickets || []).map((ticket) => {
        const departureTime = new Date(ticket.departureTime || ""); // Xử lý undefined
        const arrivalTime = new Date(ticket.arrivalTime || ""); // Xử lý undefined
        const durationMs = arrivalTime - departureTime;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const duration = isNaN(durationMs)
          ? "N/A"
          : `${durationHours}h ${durationMinutes}m`;

        console.log(`Mapping ticket for BookingId ${booking.bookingId}:`, {
          departureTime,
          arrivalTime,
          duration,
        }); // Debug từng ticket

        return {
          BookingId: booking.bookingId || "N/A",
          Airline: ticket.airline?.name || "N/A",
          From: ticket.departureAirport?.name || "N/A",
          To: ticket.arrivalAirport?.name || "N/A",
          Departure:
            departureTime.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) || "N/A",
          Arrival:
            arrivalTime.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) || "N/A",
          Duration: duration,
          BookedOn: booking.bookedOn || "N/A",
          TotalPrice: booking.totalPrice || 0,
        };
      })
    );
    console.log("Mapped Bookings Length:", result.length); // Kiểm tra tổng số vé
    return result;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[190px] mt-3"
        onClick={() => navigate("/")}
      >
        <BiArrowBack size={20} />
      </Button>

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
                You do not have any tickets or non-download data.
              </p>
            )}
          {!bookingsLoading &&
            !bookingsError &&
            bookings &&
            bookings.length > 0 && (
              <BookedTicketsTable
                tickets={mappedBookings}
                onAirlineClick={handleAirlineClick}
                onDownloadPdf={handleDownloadPdf}
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
