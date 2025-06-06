// Libs
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
// Others
import {
  getListTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getPlanesByAirline,
} from "../../thunk/ticketThunk";
import { getListAirports } from "../../thunk/airportThunk";
import { getAirlines } from "../../thunk/airlineThunk";
// Styles, images, icons
import { BiArrowBack } from "react-icons/bi";

const Tickets = () => {
  //#region Declare Hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const { tickets, airlines, airports, loading, error, planesByAirline } =
    useSelector((state) => state.ticket);
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
    planeId: "",
    departureTime: "",
    arrivalTime: "",
    stops: "",
    price: "",
    flightClass: "",
    availableSeats: "",
  });
  const [displayedTickets, setDisplayedTickets] = useState(tickets);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getListTickets());
    dispatch(getAirlines());
    dispatch(getListAirports());
  }, [dispatch]);

  useEffect(() => {
    if (formData.airlineId) {
      dispatch(getPlanesByAirline(formData.airlineId))
        .unwrap()
        .catch((err) => {
          toast.warn(
            "Không thể tải danh sách máy bay! Vui lòng kiểm tra kết nối hoặc server."
          );
        });
    }
  }, [formData.airlineId, dispatch]);

  useEffect(() => {
    if (
      formData.airlineId &&
      planesByAirline.length === 0 &&
      !loading &&
      error
    ) {
      toast.warn("No plane for this airline!");
    }
  }, [planesByAirline, loading, error, formData.airlineId]);

  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      const keyword = searchTerm.toLowerCase();

      return (
        ticket.id.toString().includes(keyword) ||
        ticket.airline?.name?.toLowerCase().includes(keyword) ||
        ticket.departureAirport?.name?.toLowerCase().includes(keyword) ||
        ticket.arrivalAirport?.name?.toLowerCase().includes(keyword) ||
        ticket.plane?.name?.toLowerCase().includes(keyword) ||
        ticket.departureTime?.toLowerCase().includes(keyword) ||
        ticket.arrivalTime?.toLowerCase().includes(keyword) ||
        ticket.price?.toString().includes(keyword) ||
        ticket.flightClass?.toLowerCase().includes(keyword) ||
        ticket.availableSeats?.toString().includes(keyword)
      );
    });

    setDisplayedTickets(filtered);
  }, [searchTerm, tickets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const departureTime = formData.departureTime;
    const arrivalTime = formData.arrivalTime;

    if (
      !formData.airlineId ||
      !formData.planeId ||
      !formData.departureAirportId ||
      !formData.arrivalAirportId ||
      !formData.departureTime ||
      !formData.arrivalTime ||
      !formData.stops ||
      !formData.price ||
      !formData.flightClass ||
      !formData.availableSeats
    ) {
      toast.error("Please fill in the mandatory schools!");
      return false;
    }

    if (departureTime >= arrivalTime) {
      toast.error("Departure time must be before the coming time!");
      return false;
    }

    if (parseFloat(formData.price) < 0) {
      toast.error("The ticket price is not negative!");
      return false;
    }

    if (parseInt(formData.availableSeats) < 0) {
      toast.error("Number of available seats is not negative!");
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

    const payload = {
      Id: isEditing ? editingId : 0,
      airlineId: parseInt(formData.airlineId),
      departureAirportId: parseInt(formData.departureAirportId),
      arrivalAirportId: parseInt(formData.arrivalAirportId),
      planeId: parseInt(formData.planeId),
      departureTime: formData.departureTime + ":00+07:00",
      arrivalTime: formData.arrivalTime + ":00+07:00",
      stops: parseInt(formData.stops),
      price: parseFloat(formData.price),
      flightClass: formData.flightClass,
      availableSeats: parseInt(formData.availableSeats),
    };

    try {
      if (isEditing) {
        await dispatch(
          updateTicket({ id: editingId, ticketData: payload })
        ).unwrap();
        toast.success("Update tickets successfully!");
      } else {
        await dispatch(createTicket(payload)).unwrap();
        toast.success("Create successful tickets!");
      }
      await dispatch(getListTickets()).unwrap();
      closeModal();
    } catch (err) {
      const errorMessage = err.message || "Đã xảy ra lỗi!";
      toast.error(
        `Failure: ${
          isEditing
            ? "Update the failed ticket - "
            : "Create failure tickets - "
        }${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ticket) => {
    setIsEditing(true);
    setEditingId(ticket.id);
    setFormData({
      airlineId: ticket.airlineId.toString(),
      departureAirportId: ticket.departureAirportId.toString(),
      arrivalAirportId: ticket.arrivalAirportId.toString(),
      planeId: ticket.planeId.toString(),
      departureTime: ticket.departureTime.slice(0, 16),
      arrivalTime: ticket.arrivalTime.slice(0, 16),
      stops: ticket.stops.toString(),
      price: ticket.price.toString(),
      flightClass: ticket.flightClass,
      availableSeats: ticket.availableSeats.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this ticket?")) {
      dispatch(deleteTicket(id))
        .unwrap()
        .then(() => {
          toast.success("Delete tickets successfully!");
          dispatch(getListTickets()).unwrap();
        })
        .catch(() => toast.error("Delete the failure ticket!"));
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData({
      airlineId: "",
      departureAirportId: "",
      arrivalAirportId: "",
      planeId: "",
      departureTime: "",
      arrivalTime: "",
      stops: "",
      price: "",
      flightClass: "",
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
    const sortedTickets = [...tickets].sort((a, b) => {
      if (e.target.value === "price") return a.price - b.price;
      return a.id - b.id;
    });
    dispatch({ type: "ticket/setTickets", payload: sortedTickets });
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.airline?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.departureAirport?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ticket.arrivalAirport?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getListTickets())
      .unwrap()
      .catch((err) => {
        toast.error("Error when downloading the ticket list!");
      });
  };
  //#endregion Handle Function

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[110px] mt-3"
        onClick={() => navigate("/")}
      >
        <BiArrowBack size={20} />
      </Button>
      <main className="flex-grow bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Tickets</h2>
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
              {/* <select
                value={sortOption}
                onChange={handleSort}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">Sort by ID</option>
                <option value="price">Sort by Price</option>
              </select> */}
            </div>
            <button
              onClick={openModal}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              CREATE TICKET
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                  {isEditing ? "Edit Ticket" : "Create Ticket"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Airline
                      </label>
                      <select
                        name="airlineId"
                        value={formData.airlineId}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      >
                        <option value="">Select Airline</option>
                        {airlines.length === 0 ? (
                          <option disabled>Không có hãng hàng không nào</option>
                        ) : (
                          airlines.map((airline) => (
                            <option key={airline.id} value={airline.id}>
                              {airline.name} ({airline.country?.name || "N/A"})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plane
                      </label>
                      <select
                        name="planeId"
                        value={formData.planeId}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                        disabled={!formData.airlineId}
                      >
                        <option value="">Select Plane</option>
                        {planesByAirline.length === 0 ? (
                          <option disabled>Không có máy bay nào</option>
                        ) : (
                          planesByAirline.map((plane) => (
                            <option key={plane.id} value={plane.id}>
                              {plane.name} ({plane.code})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Airport
                      </label>
                      <select
                        name="departureAirportId"
                        value={formData.departureAirportId}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      >
                        <option value="">Select Departure Airport</option>
                        {airports.length === 0 ? (
                          <option disabled>Không có sân bay nào</option>
                        ) : (
                          airports.map((airport) => (
                            <option key={airport.id} value={airport.id}>
                              {airport.name} ({airport.code})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Airport
                      </label>
                      <select
                        name="arrivalAirportId"
                        value={formData.arrivalAirportId}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      >
                        <option value="">Select Arrival Airport</option>
                        {airports.length === 0 ? (
                          <option disabled>Không có sân bay nào</option>
                        ) : (
                          airports.map((airport) => (
                            <option key={airport.id} value={airport.id}>
                              {airport.name} ({airport.code})
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Time
                      </label>
                      <input
                        type="datetime-local"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Time
                      </label>
                      <input
                        type="datetime-local"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stops
                      </label>
                      <input
                        type="number"
                        name="stops"
                        value={formData.stops}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        name="availableSeats"
                        value={formData.availableSeats}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flight Class
                    </label>
                    <select
                      name="flightClass"
                      value={formData.flightClass}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 transition duration-150 ease-in-out"
                      required
                    >
                      <option value="">Select Flight Class</option>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Handling ..."
                        : isEditing
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-4">Loading...</p>
            ) : filteredTickets.length === 0 ? (
              <p className="p-4">No tickets found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Airline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure Airport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arrival Airport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plane
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arrival Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flight Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.airline?.name || ticket.airlineId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.departureAirport?.name ||
                            ticket.departureAirportId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.arrivalAirport?.name ||
                            ticket.arrivalAirportId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.plane?.name || ticket.planeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(ticket.departureTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(ticket.arrivalTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.flightClass}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.availableSeats}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(ticket)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;
