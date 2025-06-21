// Libs
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import AccountInfo from "../../components/accountInfo/AccountInfo";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
import BookedTicketsTable from "../../components/bookedTicketTable/BookedTicketTable";
import ReservationDetailModal from "../../components/reservationDetailModal/ReservationDetailModal";
// Others
import { getUserReservations } from "../../thunk/userReservationThunk";
import { getReservationDetail } from "../../thunk/reservationDetailThunk";
// Styles, images, icons
import { BiArrowBack, BiDownload } from "react-icons/bi";
import { downloadReservationPdf } from "../../thunk/pdfGenerationThunk";

const ReservationsPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const {
    reservations,
    loading: reservationsLoading,
    error: reservationsError,
  } = useSelector((state) => state.userReservation);

  const {
    reservationDetail,
    loading: detailLoading,
    error: detailError,
  } = useSelector((state) => state.reservationDetail);

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
    dispatch(getUserReservations())
      .unwrap()
      .then((payload) => {
        console.log("API Response:", payload); // Kiểm tra số lượng reservations
      })
      .catch((error) => {
        console.log("API Error:", error);
        toast.error(`Failed to fetch reservations: ${error.message || error}`);
      });
  }, [dispatch]);

  useEffect(() => {
    console.log("Reservation Detail State:", {
      reservationDetail,
      detailLoading,
      detailError,
      isModalOpen,
    });
    if (isModalOpen && reservationDetail && !detailLoading) {
      console.log("Modal should be visible with data:", reservationDetail);
    } else if (isModalOpen && detailLoading) {
      console.log("Modal delayed due to loading:", detailLoading);
    }
  }, [reservationDetail, detailLoading, detailError, isModalOpen]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleAirlineClick = (reservationId) => {
    if (detailLoading) {
      return;
    }
    dispatch(getReservationDetail(reservationId))
      .unwrap()
      .then(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        toast.error(
          `Cannot retrieve reservation details: ${error.message || error}`
        );
      });
  };

  const handleDownloadPdf = (reservationId) => {
    if (pdfLoading) {
      return;
    }
    dispatch(downloadReservationPdf(reservationId))
      .unwrap()
      .then(() => {
        if (pdfError) {
          toast.error(`Error downloading PDF: ${pdfError}`);
        } else if (pdfSuccess) {
          toast.success(
            `PDF downloaded successfully for reservation ${reservationId}`
          );
        }
      })
      .catch((error) => {
        toast.error(`Error downloading PDF: ${error.message || error}`);
      });
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //#endregion Handle Function

  const mappedReservations = useMemo(() => {
    console.log("Raw reservations:", reservations); // Debug dữ liệu thô
    if (!Array.isArray(reservations)) return [];
    const result = reservations.flatMap((reservation) =>
      (reservation.Tickets || []).map((ticket) => {
        const departureTime = new Date(ticket.DepartureTime || "");
        const arrivalTime = new Date(ticket.ArrivalTime || "");
        const durationMs = arrivalTime - departureTime;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const duration = isNaN(durationMs)
          ? "N/A"
          : `${durationHours}h ${durationMinutes}m`;

        console.log(
          `Mapping ticket for ReservationId ${reservation.ReservationId}:`,
          {
            departureTime,
            arrivalTime,
            duration,
          }
        ); // Debug từng ticket

        return {
          ReservationId: reservation.ReservationId || "N/A",
          Airline: ticket.Airline?.Name || "N/A",
          From: ticket.DepartureAirport?.Name || "N/A",
          To: ticket.ArrivalAirport?.Name || "N/A",
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
          BookedOn: reservation.BookedOn || "N/A",
          TotalPrice: reservation.TotalPrice || 0,
        };
      })
    );
    console.log("Mapped Reservations Length:", result.length); // Kiểm tra tổng số vé
    return result;
  }, [reservations]);

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
            Reservations are booked
          </h2>
          {reservationsLoading && <p className="text-gray-600">Loading...</p>}
          {reservationsError && (
            <p className="text-red-600">
              Error when downloading the reservation list: {reservationsError}
            </p>
          )}
          {!reservationsLoading &&
            !reservationsError &&
            (!reservations || reservations.length === 0) && (
              <p className="text-gray-600">
                You do not have any reservations or non-downloaded data.
              </p>
            )}
          {!reservationsLoading &&
            !reservationsError &&
            reservations &&
            reservations.length > 0 && (
              <BookedTicketsTable
                tickets={mappedReservations}
                onAirlineClick={handleAirlineClick}
                onDownloadPdf={handleDownloadPdf}
              />
            )}
        </div>
      </div>
      <Footer />

      {/* Modal hiển thị chi tiết vé */}
      <ReservationDetailModal
        reservationId={isModalOpen ? reservationDetail?.ReservationId : null} // Sử dụng reservationId thay vì isOpen
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ReservationsPage;
