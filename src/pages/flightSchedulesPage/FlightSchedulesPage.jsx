// Libs
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
// Others
import {
  getListFlightSchedules,
  createFlightSchedule,
  updateFlightSchedule,
  deleteFlightSchedule,
  getAircraftsByAirline,
} from "../../thunk/flightScheduleThunk";
import { getListAirports } from "../../thunk/airportThunk";
import { getAirlines } from "../../thunk/airlineThunk";
// Styles, images, icons
import { BiArrowBack } from "react-icons/bi";

const FlightSchedulesPage = () => {
  //#region Declare Hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const flightScheduleState = useSelector(
    (state) => state.flightSchedule || {}
  );
  const airlineState = useSelector(
    (state) => state.airline || { list: [], loading: false, error: null }
  );
  const airportState = useSelector(
    (state) => state.airports || { data: [], loading: false, error: null }
  );

  const {
    flightSchedules,
    loading: flightScheduleLoading,
    error: flightScheduleError,
    aircraftsByAirline,
  } = flightScheduleState;
  const {
    list: airlines,
    loading: airlineLoading,
    error: airlineError,
  } = airlineState;
  const {
    data: airports,
    loading: airportLoading,
    error: airportError,
  } = airportState;

  //#endregion Selector

  //#region Declare State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    airlineId: "",
    departureAirportId: "",
    arrivalAirportId: "",
    aircraftId: "",
    departureTime: "",
    arrivalTime: "",
    stops: "",
    price: "",
    flightClass: "",
    availableSeats: "",
  });
  const [displayedFlightSchedules, setDisplayedFlightSchedules] = useState([]);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getListFlightSchedules()).unwrap(),
          dispatch(getAirlines()).unwrap(),
          dispatch(getListAirports()).unwrap(),
        ]);
        console.log("Airlines loaded from state.airline:", airlines); // Debug
      } catch (err) {
        // ...
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (formData.airlineId) {
      dispatch(getAircraftsByAirline(formData.airlineId))
        .unwrap()
        .then((data) => console.log("Aircrafts by airline loaded:", data))
        .catch((err) => {
          console.error("Failed to fetch aircrafts:", err);
          toast.warn(
            `Không thể tải danh sách máy bay: ${
              err.message || "Vui lòng kiểm tra kết nối hoặc server"
            }`
          );
        });
    }
  }, [formData.airlineId, dispatch]);

  useEffect(() => {
    if (
      formData.airlineId &&
      aircraftsByAirline.length === 0 &&
      !flightScheduleLoading &&
      flightScheduleError
    ) {
      toast.warn("No aircraft for this airline!");
    }
  }, [
    aircraftsByAirline,
    flightScheduleLoading,
    flightScheduleError,
    formData.airlineId,
  ]);

  useEffect(() => {
    setDisplayedFlightSchedules(flightSchedules || []);
    const filtered = (flightSchedules || []).filter((schedule) => {
      const keyword = searchTerm.toLowerCase();
      return (
        (schedule.id?.toString() || "").includes(keyword) ||
        (schedule.airline?.name?.toLowerCase() || "").includes(keyword) ||
        (schedule.departure_airport?.name?.toLowerCase() || "").includes(
          keyword
        ) ||
        (schedule.arrival_airport?.name?.toLowerCase() || "").includes(
          keyword
        ) ||
        (schedule.aircraft?.name?.toLowerCase() || "").includes(keyword) ||
        (schedule.departure_time &&
          new Date(schedule.departure_time)
            .toLocaleString()
            .toLowerCase()
            .includes(keyword)) ||
        (schedule.arrival_time &&
          new Date(schedule.arrival_time)
            .toLocaleString()
            .toLowerCase()
            .includes(keyword)) ||
        (schedule.price?.toString() || "").includes(keyword) ||
        (schedule.flight_class?.toLowerCase() || "").includes(keyword) ||
        (schedule.available_seats?.toString() || "").includes(keyword)
      );
    });
    setDisplayedFlightSchedules(filtered);
  }, [searchTerm, flightSchedules]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to value:`, value); // Debug
    const newValue =
      value === "undefined" || value === undefined || value === null
        ? ""
        : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (name === "flightClass") {
      console.log("Updated flightClass:", newValue); // Kiểm tra giá trị
    }
  };

  const validateForm = () => {
    const departureTime = new Date(formData.departureTime);
    const arrivalTime = new Date(formData.arrivalTime);

    if (
      !formData.airlineId ||
      !formData.aircraftId ||
      !formData.departureAirportId ||
      !formData.arrivalAirportId ||
      !formData.departureTime ||
      !formData.arrivalTime ||
      !formData.stops ||
      !formData.price ||
      !formData.flightClass ||
      !formData.availableSeats
    ) {
      toast.error("Please fill in the mandatory fields!");
      return false;
    }

    if (isNaN(departureTime) || isNaN(arrivalTime)) {
      toast.error("Invalid date/time format!");
      return false;
    }

    if (departureTime >= arrivalTime) {
      toast.error("Departure time must be before arrival time!");
      return false;
    }

    if (parseFloat(formData.price) < 0) {
      toast.error("The ticket price cannot be negative!");
      return false;
    }

    if (parseInt(formData.availableSeats) < 0) {
      toast.error("Number of available seats cannot be negative!");
      return false;
    }

    if (!formData.flightClass || formData.flightClass === "") {
      toast.error("Please select a flight class!");
      return false;
    }

    const airline = airlines.find((a) => a.id === parseInt(formData.airlineId));
    if (!airline || isNaN(parseInt(formData.airlineId))) {
      toast.error("Selected airline does not exist or is invalid!");
      return false;
    }

    return true;
  };
  //#endregion Implement Hook

  //#region Handle Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    console.log("FormData before submission:", formData); // Debug
    const payload = {
      Id: isEditing ? editingId : 0,
      AirlineId: parseInt(formData.airlineId),
      DepartureAirportId: parseInt(formData.departureAirportId),
      ArrivalAirportId: parseInt(formData.arrivalAirportId),
      PlaneId: parseInt(formData.aircraftId),
      DepartureTime: new Date(formData.departureTime).toISOString(),
      ArrivalTime: new Date(formData.arrivalTime).toISOString(),
      Stops: parseInt(formData.stops),
      Price: parseFloat(formData.price),
      flight_class: formData.flightClass || "Economy", // Đảm bảo có giá trị
      AvailableSeats: parseInt(formData.availableSeats),
      LastUpdate: null,
      DynamicPrice: null,
    };
    console.log("Payload sent:", JSON.stringify(payload, null, 2));

    try {
      if (isEditing) {
        await dispatch(
          updateFlightSchedule({ id: editingId, flightScheduleData: payload })
        ).unwrap();
        toast.success("Flight schedule updated successfully!");
      } else {
        await dispatch(createFlightSchedule(payload)).unwrap();
        toast.success("Flight schedule created successfully!");
      }
      await dispatch(getListFlightSchedules()).unwrap();
      closeModal();
    } catch (err) {
      console.error("Error creating/updating flight schedule:", err);
      let errorMessage = "An error occurred!";
      if (typeof err === "object" && err.message) {
        errorMessage = err.message;
      } else if (err?.errors) {
        errorMessage = Object.values(err.errors).flat().join(", ");
      }
      toast.error(
        `Failure: ${
          isEditing ? "Update failed - " : "Creation failed - "
        }${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (schedule) => {
    setIsEditing(true);
    setEditingId(schedule.id);
    setFormData({
      airlineId: schedule.airline_id?.toString() || "",
      departureAirportId: schedule.departure_airport_id?.toString() || "",
      arrivalAirportId: schedule.arrival_airport_id?.toString() || "",
      aircraftId: schedule.plane_id?.toString() || "",
      departureTime: schedule.departure_time
        ? new Date(schedule.departure_time).toISOString().slice(0, 16)
        : "",
      arrivalTime: schedule.arrival_time
        ? new Date(schedule.arrival_time).toISOString().slice(0, 16)
        : "",
      stops: schedule.stops?.toString() || "",
      price: schedule.price?.toString() || "",
      flightClass: schedule.flight_class || "",
      availableSeats: schedule.available_seats?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this flight schedule?")) {
      dispatch(deleteFlightSchedule(id))
        .unwrap()
        .then(() => {
          toast.success("Flight schedule deleted successfully!");
          dispatch(getListFlightSchedules()).unwrap();
        })
        .catch(() => toast.error("Failed to delete flight schedule!"));
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      airlineId: "",
      departureAirportId: "",
      arrivalAirportId: "",
      aircraftId: "",
      departureTime: "",
      arrivalTime: "",
      stops: "",
      price: "",
      flightClass: "Economy", // Đặt mặc định là "Economy"
      availableSeats: "",
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
    const sortedFlightSchedules = [...displayedFlightSchedules].sort((a, b) => {
      if (e.target.value === "price") return (a.price || 0) - (b.price || 0);
      return (a.id || 0) - (b.id || 0);
    });
    setDisplayedFlightSchedules(sortedFlightSchedules);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getListFlightSchedules())
      .unwrap()
      .catch((err) => {
        toast.error("Error when downloading the flight schedule list!");
      });
  };
  //#endregion Handle Function

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[110px] mt-3"
        onClick={() => navigate("/admin")}
      >
        <BiArrowBack size={20} />
      </Button>
      <main className="flex-grow bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Flight Schedules
          </h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search flight schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
              <select
                value={sortOption}
                onChange={handleSort}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">Sort by ID</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
            <button
              onClick={openModal}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              disabled={flightScheduleLoading || isSubmitting}
            >
              CREATE FLIGHT SCHEDULE
            </button>
          </div>

          {flightScheduleLoading && (
            <p className="p-4 text-center">Loading flight schedules...</p>
          )}
          {(flightScheduleError || airlineError || airportError) && (
            <p className="p-4 text-red-600 text-center">
              Error: {flightScheduleError || airlineError || airportError}
            </p>
          )}
          {displayedFlightSchedules.length === 0 &&
            !flightScheduleLoading &&
            !flightScheduleError && (
              <p className="p-4 text-center">No flight schedules found.</p>
            )}
          {displayedFlightSchedules.length > 0 &&
            !flightScheduleLoading &&
            !flightScheduleError && (
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        ID
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Airline
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Departure Airport
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Arrival Airport
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Aircraft
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Departure Time
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Arrival Time
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Price
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Flight Class
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Available Seats
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedFlightSchedules.map((schedule) => (
                      <tr
                        key={
                          schedule.id || Math.random().toString(36).substr(2, 9)
                        }
                      >
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.id || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.airline?.name || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.departure_airport?.name || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.arrival_airport?.name || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.aircraft?.name || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.departure_time &&
                          !isNaN(new Date(schedule.departure_time).getTime())
                            ? new Date(schedule.departure_time).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.arrival_time &&
                          !isNaN(new Date(schedule.arrival_time).getTime())
                            ? new Date(schedule.arrival_time).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          ${schedule.price?.toFixed(2) || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.flight_class || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {schedule.available_seats || "N/A"}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <Button
                            primary
                            className="px-3 py-1 rounded mr-2"
                            onClick={() => handleEdit(schedule)}
                            disabled={flightScheduleLoading || isSubmitting}
                          >
                            Edit
                          </Button>
                          <Button
                            danger
                            className="px-3 py-1 rounded"
                            onClick={() => handleDelete(schedule.id)}
                            disabled={flightScheduleLoading || isSubmitting}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Flight Schedule" : "Create Flight Schedule"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <select
                  name="airlineId"
                  value={formData.airlineId || ""} // Đảm bảo giá trị mặc định là chuỗi rỗng
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={airlineLoading || isSubmitting}
                >
                  <option value="">Select Airline</option>
                  {Array.isArray(airlines) ? (
                    airlines.length > 0 ? (
                      airlines
                        .filter(
                          (airline) =>
                            airline.id !== 0 && airline.name !== "string"
                        ) // Loại bỏ dữ liệu mẫu
                        .map((airline) => (
                          <option key={airline.id} value={airline.id}>
                            {airline.name || `Airline ${airline.id}`}
                          </option>
                        ))
                    ) : (
                      <option disabled>
                        {airlineLoading
                          ? "Loading airlines..."
                          : "No airlines available"}
                      </option>
                    )
                  ) : (
                    <option disabled>
                      {airlineError || "Invalid airline data"}
                    </option>
                  )}
                </select>
                <select
                  name="departureAirportId"
                  value={formData.departureAirportId || ""} // Đảm bảo giá trị mặc định là chuỗi rỗng
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={airportLoading || isSubmitting}
                >
                  <option value="">Select Departure Airport</option>
                  {Array.isArray(airports) ? (
                    airports.length > 0 ? (
                      airports.map((airport) => (
                        <option key={airport.id} value={airport.id}>
                          {airport.name || `Airport ${airport.id}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>
                        {airportLoading
                          ? "Loading airports..."
                          : "No airports available"}
                      </option>
                    )
                  ) : (
                    <option disabled>
                      {airportError || "Invalid airport data"}
                    </option>
                  )}
                </select>
                <select
                  name="arrivalAirportId"
                  value={formData.arrivalAirportId || ""} // Đảm bảo giá trị mặc định là chuỗi rỗng
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={airportLoading || isSubmitting}
                >
                  <option value="">Select Arrival Airport</option>
                  {Array.isArray(airports) ? (
                    airports.length > 0 ? (
                      airports.map((airport) => (
                        <option key={airport.id} value={airport.id}>
                          {airport.name || `Airport ${airport.id}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>
                        {airportLoading
                          ? "Loading airports..."
                          : "No airports available"}
                      </option>
                    )
                  ) : (
                    <option disabled>
                      {airportError || "Invalid airport data"}
                    </option>
                  )}
                </select>
                <select
                  name="aircraftId"
                  value={formData.aircraftId || ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={
                    flightScheduleLoading || isSubmitting || !formData.airlineId
                  }
                >
                  <option value="">Select Aircraft</option>
                  {Array.isArray(aircraftsByAirline) ? (
                    aircraftsByAirline.length > 0 ? (
                      aircraftsByAirline.map((aircraft) => (
                        <option key={aircraft.id} value={aircraft.id}>
                          {aircraft.name || `Aircraft ${aircraft.id}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>
                        {formData.airlineId
                          ? "No aircrafts available"
                          : "Select an airline first"}
                      </option>
                    )
                  ) : (
                    <option disabled>
                      {flightScheduleError || "Invalid aircraft data"}
                    </option>
                  )}
                </select>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={flightScheduleLoading || isSubmitting}
                />
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={flightScheduleLoading || isSubmitting}
                />
                <input
                  type="number"
                  name="stops"
                  value={formData.stops}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Stops"
                  disabled={flightScheduleLoading || isSubmitting}
                />
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Price"
                  disabled={flightScheduleLoading || isSubmitting}
                />
                <select
                  name="flightClass"
                  value={formData.flightClass || "Economy"} // Mặc định "Economy" nếu rỗng
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  disabled={flightScheduleLoading || isSubmitting}
                  required
                >
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Available Seats"
                  disabled={flightScheduleLoading || isSubmitting}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  className="px-4 py-2 rounded"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  className="px-4 py-2 rounded"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEditing
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSchedulesPage;
