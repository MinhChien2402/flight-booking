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
import { rescheduleReservation } from "../../thunk/reservationThunk";
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
  } = useSelector((state) => state.reservationDetail);

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
  const [rescheduling, setRescheduling] = useState(false); // Thêm trạng thái loading
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
    });
    if (isModalOpen && !detailLoading && reservationDetail) {
      console.log("Modal should be visible with data:", reservationDetail);
    } else if (isModalOpen && detailLoading) {
      console.log("Modal delayed due to loading:", detailLoading);
    }
  }, [reservationDetail, detailLoading, isModalOpen]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleAirlineClick = (reservationId) => {
    console.log("handleAirlineClick called with reservationId:", reservationId);
    if (detailLoading) {
      console.log("Detail loading, skipping...");
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
          (Array.isArray(response.Tickets) ||
            Array.isArray(response.Passengers))
        ) {
          console.log("Data valid, opening modal...");
          setIsModalOpen(true);
        } else {
          console.error("Invalid data structure:", response);
          toast.error("Dữ liệu đặt chỗ không đầy đủ hoặc không hợp lệ.");
        }
      })
      .catch((error) => {
        console.error("Error fetching reservation detail:", error);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    dispatch(resetReservationDetailState());
  };

  const handleReschedule = (reservationId) => {
    setSelectedReservationId(reservationId);
    if (reservationDetail && reservationDetail.Tickets.length > 0) {
      const ticket = reservationDetail.Tickets[0];
      setSearchParams({
        DepartureAirportId: ticket.FromId || ticket.From, // Sử dụng FromId nếu có, hoặc From
        ArrivalAirportId: ticket.ToId || ticket.To, // Sử dụng ToId nếu có, hoặc To
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
      if (
        detailResponse &&
        Array.isArray(detailResponse.Tickets) &&
        Array.isArray(detailResponse.Passengers)
      ) {
        setIsModalOpen(true); // Mở modal để hiển thị thông tin mới
      } else {
        toast.error("Dữ liệu đặt chỗ mới không đầy đủ.");
      }
    } catch (error) {
      toast.error(`Lỗi khi reschedule đặt chỗ: ${error.message || error}`);
    } finally {
      setRescheduling(false);
    }
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedNewFlightId(null);
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
              />
            )}
        </div>
      </div>
      <Footer />
      <ReservationDetailModal
        reservationId={isModalOpen ? selectedReservationId : null}
        onClose={handleCloseModal}
      />
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
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
    </div>
  );
};

export default ReservationsPage;
