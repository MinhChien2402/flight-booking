// Libs
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BiArrowBack, BiDownload } from "react-icons/bi";
// Components, Layouts, Pages
import AccountInfo from "../../components/accountInfo/AccountInfo";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
import BookedTicketsTable from "../../components/bookedTicketTable/BookedTicketTable";
import ReservationDetailModal from "../../components/reservationDetailModal/ReservationDetailModal";
// Others
import { resetReservationDetailState } from "../../ultis/redux/reservationDetailSlice";
import { downloadReservationPdf } from "../../thunk/pdfGenerationThunk";
import { getReservationDetail } from "../../thunk/reservationDetailThunk";
import { getUserReservations } from "../../thunk/userReservationThunk";
// Styles, images, icons
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
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    // Reset reservation detail state khi vào trang
    dispatch(resetReservationDetailState());

    // Kiểm tra và gọi API nếu cần, bao gồm khi dữ liệu không hợp lệ
    if (
      !reservationsLoading &&
      (!reservations ||
        reservations.length === 0 ||
        reservations.some((r) => !r.tickets?.length))
    ) {
      dispatch(getUserReservations())
        .unwrap()
        .then((payload) => {
          console.log("Fetched reservations:", payload);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error(
            `Failed to fetch reservations: ${error.message || error}`
          );
        });
    }
  }, [dispatch, reservationsLoading, reservations]);

  useEffect(() => {
    console.log("Reservation Detail State:", {
      reservationDetail,
      detailLoading,
      detailError,
      isModalOpen,
    });
    if (isModalOpen && !detailLoading && reservationDetail) {
      console.log("Modal should be visible with data:", reservationDetail);
    } else if (isModalOpen && detailLoading) {
      console.log("Modal delayed due to loading:", detailLoading);
    }
  }, [reservationDetail, detailLoading, detailError, isModalOpen]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleAirlineClick = (reservationId) => {
    if (detailLoading) return;
    setSelectedReservationId(reservationId);
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
    if (pdfLoading) return;
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    dispatch(resetReservationDetailState()); // Reset state khi đóng modal
  };

  const mappedReservations = useMemo(() => {
    console.log("Raw reservations:", reservations);
    if (!Array.isArray(reservations)) {
      console.warn("Reservations is not an array:", reservations);
      return [];
    }
    const result = reservations.flatMap((reservation) => {
      console.log("Processing reservation:", reservation);
      return (reservation.tickets || []).map((ticket, index) => {
        // [SỬA] Parse date theo định dạng dd/MM/yyyy HH:mm
        const [departureDate, departureTime] = (
          ticket.departureTime || ""
        ).split(" ");
        const [arrivalDate, arrivalTime] = (ticket.arrivalTime || "").split(
          " "
        );
        const departureParts = departureDate.split("/").map(Number);
        const arrivalParts = arrivalDate.split("/").map(Number);
        const departure = new Date(
          departureParts[2],
          departureParts[1] - 1,
          departureParts[0],
          ...(departureTime || "00:00").split(":").map(Number)
        );
        const arrival = new Date(
          arrivalParts[2],
          arrivalParts[1] - 1,
          arrivalParts[0],
          ...(arrivalTime || "00:00").split(":").map(Number)
        );

        const durationMs = arrival - departure;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const duration =
          isNaN(durationMs) || durationMs < 0
            ? "N/A"
            : `${durationHours}h ${durationMinutes}m`;

        return {
          reservationId: reservation.reservationId || reservation.Id || "N/A",
          flightScheduleId: ticket.id || "N/A",
          Airline: ticket.airline?.name || "N/A",
          From: ticket.departureAirport?.name || "N/A",
          To: ticket.arrivalAirport?.name || "N/A",
          Departure: isNaN(departure)
            ? "N/A"
            : departure.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
          Arrival: isNaN(arrival)
            ? "N/A"
            : arrival.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
          Duration: duration,
          BookedOn:
            new Date(reservation.bookedOn || "").toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }) || "N/A",
          TotalPrice: reservation.totalPrice || 0,
          Status: reservation.status || "N/A",
        };
      });
    });
    console.log("Mapped reservations result:", result);
    return result;
  }, [reservations]);
  //#endregion Handle Function

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
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <AccountInfo />
        </div>
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
      <ReservationDetailModal
        reservationId={isModalOpen ? selectedReservationId : null}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ReservationsPage;
