// Libs
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BiArrowBack, BiDownload } from "react-icons/bi";
import moment from "moment";

// Components, Layouts, Pages
import AccountInfo from "../../components/accountInfo/AccountInfo";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
import BookedTicketsTable from "../../components/bookedTicketTable/BookedTicketTable";
import ReservationDetailModal from "../../components/reservationDetailModal/ReservationDetailModal";
import FlightSearchForm from "../../components/flightSearchForm/FlightSearchForm";

// Others
import { resetReservationDetailState } from "../../ultis/redux/reservationDetailSlice";
import { downloadReservationPdf } from "../../thunk/pdfGenerationThunk";
import { getReservationDetail } from "../../thunk/reservationDetailThunk";
import { getUserReservations } from "../../thunk/userReservationThunk";
import {
  rescheduleReservation,
  cancelReservation,
  getCancelRules,
} from "../../thunk/reservationThunk";
import { searchFlightSchedules } from "../../thunk/flightScheduleThunk";

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
    cancelSuccess,
  } = useSelector((state) => state.reservationDetail); // Bỏ cancelRules, cancelLoading, cancelError vì dùng local state

  const {
    loading: pdfLoading,
    error: pdfError,
    success: pdfSuccess,
  } = useSelector((state) => state.pdf);

  const {
    outboundTickets: availableFlights,
    loading: flightSearchLoading,
    error: flightSearchError,
  } = useSelector(
    (state) =>
      state.flightSchedule || {
        outboundTickets: [],
        loading: false,
        error: null,
      }
  );
  //#endregion Selector

  //#region Declare State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedNewFlightId, setSelectedNewFlightId] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [rescheduling, setRescheduling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState(null);
  const [cancelData, setCancelData] = useState(null); // Local state cho dữ liệu cancel
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(resetReservationDetailState());

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
      cancelSuccess,
    });
    if (isModalOpen && !detailLoading && reservationDetail) {
      console.log("Modal should be visible with data:", reservationDetail);
    } else if (isModalOpen && detailLoading) {
      console.log("Modal delayed due to loading:", detailLoading);
    }

    if (cancelSuccess) {
      toast.success("Reservation cancelled successfully!");
      dispatch(getUserReservations()); // Cập nhật danh sách đặt chỗ
      dispatch(resetReservationDetailState()); // Reset trạng thái
      setShowCancelModal(false);
      setCancelReservationId(null);
      setCancelData(null); // Reset local data
    }
  }, [
    reservationDetail,
    detailLoading,
    detailError,
    isModalOpen,
    cancelSuccess,
    dispatch,
  ]);

  useEffect(() => {
    if (showCancelModal && cancelData) {
      console.log("Cancel modal opened with rules:", cancelData);
    }
  }, [showCancelModal, cancelData]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleAirlineClick = (reservationId) => {
    console.log("handleAirlineClick called with reservationId:", reservationId);
    if (detailLoading) {
      console.log("Detail loading, skipping...");
      return;
    }
    if (!reservationId) {
      console.error("Invalid reservationId:", reservationId);
      toast.error("Mã đặt chỗ không hợp lệ.");
      return;
    }
    setSelectedReservationId(reservationId);
    console.log("SelectedReservationId set to:", reservationId);
    dispatch(getReservationDetail(reservationId))
      .unwrap()
      .then((response) => {
        console.log("Reservation detail fetched successfully:", response);
        if (
          response &&
          ((Array.isArray(response.tickets) && response.tickets.length > 0) ||
            (Array.isArray(response.Tickets) && response.Tickets.length > 0))
        ) {
          console.log(
            "Data valid, opening modal with tickets:",
            response.tickets || response.Tickets
          );
          setIsModalOpen(true);
        } else {
          console.warn(
            "No valid tickets found for reservationId:",
            reservationId,
            "Response:",
            response
          );
          toast.error("Dữ liệu đặt chỗ không chứa thông tin vé hợp lệ.");
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching reservation detail:",
          error.response?.status,
          error.response?.data
        );
        toast.error(
          `Không thể lấy chi tiết đặt chỗ: ${error.message || error}`
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

  const handleReschedule = (reservationId) => {
    setSelectedReservationId(reservationId);
    if (reservationDetail && reservationDetail.Tickets.length > 0) {
      const ticket = reservationDetail.Tickets[0];
      setSearchParams({
        DepartureAirportId: ticket.FromId || ticket.From,
        ArrivalAirportId: ticket.ToId || ticket.To,
        DepartureDate: moment(ticket.Departure, "DD/MM/YYYY HH:mm")
          .add(1, "days")
          .format("YYYY-MM-DD"),
        TripType: "oneWay",
        Adults: 1,
        Children: 0,
        FlightClass: ticket.FlightClass || "Economy",
      });
    }
    setShowRescheduleModal(true);
  };

  const handleSearchFlights = async (params) => {
    setSearchParams(params);
    await dispatch(searchFlightSchedules(params)).unwrap();
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedNewFlightId) {
      toast.error("Vui lòng chọn chuyến bay mới!");
      return;
    }
    setRescheduling(true);
    try {
      const response = await dispatch(
        rescheduleReservation({
          reservationId: selectedReservationId,
          newFlightScheduleId: selectedNewFlightId,
        })
      ).unwrap();
      toast.success(
        `Đặt chỗ đã được reschedule! Mã xác nhận mới: ${response.newConfirmationNumber}`
      );

      // Lấy lại danh sách đặt chỗ
      const updatedReservations = await dispatch(
        getUserReservations()
      ).unwrap();
      console.log(
        "Updated reservations after reschedule:",
        updatedReservations
      );

      // Lấy chi tiết đặt chỗ mới để hiển thị trong modal
      const detailResponse = await dispatch(
        getReservationDetail(selectedReservationId)
      ).unwrap();
      console.log("Reservation detail after reschedule:", detailResponse);

      // Đóng modal reschedule và mở modal chi tiết
      setShowRescheduleModal(false);
      setSelectedNewFlightId(null);
      if (detailResponse && Array.isArray(detailResponse.tickets)) {
        setIsModalOpen(true);
      } else {
        toast.error("Dữ liệu đặt chỗ mới không đầy đủ.");
      }
    } catch (error) {
      toast.error(`Lỗi khi reschedule đặt chỗ: ${error.message || error}`);
    } finally {
      setRescheduling(false);
    }
  };

  const handleCancel = (reservationId) => {
    setCancelReservationId(reservationId);
    dispatch(getCancelRules(reservationId))
      .unwrap()
      .then((response) => {
        console.log("getCancelRules response:", response);
        setCancelData(response); // Set local state
        setShowCancelModal(true);
      })
      .catch((error) => {
        console.error("getCancelRules error:", error);
        toast.error(`Không thể lấy quy định hủy: ${error.message || error}`);
      });
  };

  const handleConfirmCancel = async () => {
    if (!cancelReservationId) {
      toast.error("Mã đặt chỗ không hợp lệ!");
      return;
    }
    try {
      const response = await dispatch(
        cancelReservation(cancelReservationId)
      ).unwrap();
      toast.success(
        `Reservation cancelled successfully! Cancellation Number: ${response.cancellationNumber}`
      );
      setCancelData(null); // Reset local data sau khi success
    } catch (error) {
      toast.error(`Lỗi khi hủy đặt chỗ: ${error.message || error}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    dispatch(resetReservationDetailState());
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedNewFlightId(null);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReservationId(null);
    setCancelData(null); // Reset local data khi close
    dispatch(resetReservationDetailState());
  };

  const mappedReservations = useMemo(() => {
    if (!Array.isArray(reservations)) {
      console.warn("Reservations is not an array:", reservations);
      return [];
    }
    return reservations.flatMap((reservation) => {
      return (reservation.tickets || []).map((ticket, index) => {
        const parseDateTime = (dateTimeStr) => {
          if (!dateTimeStr) return "N/A";
          const parsed = moment(dateTimeStr, "DD/MM/YYYY HH:mm", true);
          return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : "N/A";
        };

        const departureTime = parseDateTime(ticket.departureTime || "");
        const arrivalTime = parseDateTime(ticket.arrivalTime || "");

        const depDate = moment(
          departureTime,
          "DD/MM/YYYY HH:mm",
          true
        ).toDate();
        const arrDate = moment(arrivalTime, "DD/MM/YYYY HH:mm", true).toDate();
        const durationMs = arrDate - depDate;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const duration = isNaN(durationMs)
          ? "N/A"
          : `${durationHours}h ${durationMinutes}m`;

        return {
          reservationId: reservation.reservationId || "N/A",
          Airline: ticket.airline?.name || "N/A",
          From: ticket.departureAirport?.name || "N/A",
          To: ticket.arrivalAirport?.name || "N/A",
          Departure: departureTime,
          Arrival: arrivalTime,
          Duration: duration,
          BookedOn: reservation.bookedOn
            ? moment(reservation.bookedOn, "DD/MM/YYYY HH:mm", true).format(
                "DD/MM/YYYY HH:mm"
              )
            : "N/A",
          TotalPrice: reservation.totalPrice || 0,
          Status: reservation.status || "N/A",
        };
      });
    });
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
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            )}
        </div>
      </div>
      <Footer />
      <ReservationDetailModal
        isOpen={isModalOpen}
        reservationId={isModalOpen ? selectedReservationId : null}
        onClose={handleCloseModal}
      />
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-[64rem] w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
              Reschedule Your Flight
            </h3>
            <FlightSearchForm
              defaultData={searchParams}
              onSearch={handleSearchFlights}
              preventNavigation={true}
              className="mb-4"
            />
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {flightSearchLoading && (
                <p className="text-center text-gray-600 animate-pulse">
                  Loading flights...
                </p>
              )}
              {flightSearchError && (
                <p className="text-red-600 text-center">
                  Error: {flightSearchError}
                </p>
              )}
              {!flightSearchLoading &&
                !flightSearchError &&
                availableFlights?.length > 0 &&
                availableFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedNewFlightId(flight.id)}
                    style={{
                      backgroundColor:
                        selectedNewFlightId === flight.id
                          ? "#e0f7fa"
                          : "transparent",
                    }}
                  >
                    <p>
                      {flight.airline?.name} -{" "}
                      {moment(flight.departureTime).format("DD/MM/YYYY HH:mm")}{" "}
                      to {moment(flight.arrivalTime).format("DD/MM/YYYY HH:mm")}{" "}
                      - ${flight.price}
                    </p>
                  </div>
                ))}
              {availableFlights?.length === 0 && !flightSearchLoading && (
                <p className="text-center text-gray-600">
                  No flights available.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button onClick={handleCloseRescheduleModal}>Cancel</Button>
              <Button
                primary
                onClick={handleRescheduleConfirm}
                disabled={rescheduling || !selectedNewFlightId}
              >
                {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Cancellation</h2>
            {cancelData ? (
              <div className="space-y-4">
                <p>
                  <strong>Reservation ID:</strong>{" "}
                  {cancelData.reservationId || "N/A"}
                </p>
                <p>
                  <strong>Confirmation Number:</strong>{" "}
                  {cancelData.confirmationNumber || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {cancelData.status || "N/A"}
                </p>
                <p>
                  <strong>Cancellation Rules:</strong>{" "}
                  {cancelData.cancellationRules || "No rules available"}
                </p>
                <p>
                  <strong>Refund Percentage:</strong>
                  {cancelData.refundPercentage !== undefined
                    ? `${cancelData.refundPercentage.toFixed(1)}%`
                    : "N/A"}
                </p>
                <p>
                  <strong>Refund Amount:</strong> $
                  {cancelData.refundAmount !== undefined
                    ? cancelData.refundAmount.toFixed(2)
                    : "N/A"}
                </p>
                <div>
                  <strong>Tickets:</strong>
                  <ul className="list-disc pl-5">
                    {cancelData.tickets && cancelData.tickets.length > 0 ? (
                      cancelData.tickets.map((ticket, index) => (
                        <li key={index}>
                          {ticket.airline || "N/A"} from {ticket.from || "N/A"}{" "}
                          to {ticket.to || "N/A"}({ticket.departure || "N/A"} -{" "}
                          {ticket.arrival || "N/A"})
                        </li>
                      ))
                    ) : (
                      <li>No tickets available</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                No cancellation data available.
              </p>
            )}
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-300 text-gray-800 py-1 px-4 rounded"
                onClick={handleCloseCancelModal}
              >
                Cancel
              </button>
              <button
                className="bg-pink-600 text-white py-1 px-4 rounded"
                onClick={handleConfirmCancel}
                disabled={!cancelData}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
