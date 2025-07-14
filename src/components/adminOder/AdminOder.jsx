import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { BiArrowBack } from "react-icons/bi";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { getAllReservations } from "../../thunk/reservationThunk";
import moment from "moment"; // Thêm moment để parse date an toàn

const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.authentication);
  const { allReservations, status, error } = useSelector(
    (state) => state.reservation
  );

  // State cho search, pagination, modal
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      toast.error("Bạn không có quyền truy cập trang này.");
      return;
    }
    dispatch(getAllReservations());
  }, [dispatch, role, navigate]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error("Lỗi khi tải danh sách orders: " + error);
    }
  }, [status, error]);

  // Filter data
  const filteredReservations = allReservations.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
  };

  const handleCancel = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy order này?")) {
      toast.warning(`Đã hủy order ${orderId}`);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (status === "loading") {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600 mx-auto"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[190px] mt-3"
        onClick={() => navigate("/admin")}
      >
        <BiArrowBack size={20} />
      </Button>
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-4 mb-12">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Orders list</h1>
        <input
          type="text"
          placeholder="Search by order code or customer name ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full md:w-1/3"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b text-left">Order Number</th>
                <th className="py-2 px-4 border-b text-left">
                  Confirmation Number
                </th>
                <th className="py-2 px-4 border-b text-left">Customer</th>
                <th className="py-2 px-4 border-b text-left">Booked On</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-right">Total Price</th>
                <th className="py-2 px-4 border-b text-center">Passenger</th>
                <th className="py-2 px-4 border-b text-left">Flight</th>
                <th className="py-2 px-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-2 px-4 border-b">{order.id}</td>
                    <td className="py-2 px-4 border-b">
                      {order.confirmationNumber || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.userName || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.reservationDate
                        ? moment(
                            order.reservationDate,
                            "DD/MM/YYYY HH:mm"
                          ).format("DD/MM/YYYY")
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.reservationStatus || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      ${order.totalFare?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {order.passengerCount || 0}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.flights && order.flights.length > 0
                        ? order.flights.map((flight, index) => (
                            <div key={index} className="mb-1">
                              {flight.airline || "N/A"}: {flight.from} →{" "}
                              {flight.to} (
                              {flight.departTime
                                ? moment(
                                    flight.departTime,
                                    "DD/MM/YYYY HH:mm"
                                  ).format("DD/MM/YYYY HH:mm")
                                : "N/A"}{" "}
                              -{" "}
                              {flight.arriveTime
                                ? moment(
                                    flight.arriveTime,
                                    "DD/MM/YYYY HH:mm"
                                  ).format("DD/MM/YYYY HH:mm")
                                : "N/A"}
                              )
                            </div>
                          ))
                        : "No flight"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-red-500 hover:underline"
                      >
                        Cancellation
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No Orders matches search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Order details {selectedOrder.id}
            </h2>
            <p>
              <strong>Confirmation Number:</strong>{" "}
              {selectedOrder.confirmationNumber}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.userName}
            </p>
            <p>
              <strong>Booked On:</strong>{" "}
              {moment(selectedOrder.reservationDate, "DD/MM/YYYY HH:mm").format(
                "DD/MM/YYYY HH:mm"
              )}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.reservationStatus}
            </p>
            <p>
              <strong>Total Price:</strong> $
              {selectedOrder.totalFare.toFixed(2)}
            </p>
            <p>
              <strong>Passenger :</strong> {selectedOrder.passengerCount}
            </p>
            <div>
              <strong>Flight:</strong>
              {selectedOrder.flights.map((flight, index) => (
                <div key={index} className="ml-4">
                  - {flight.airline}: {flight.from} → {flight.to} (
                  {moment(flight.departTime, "DD/MM/YYYY HH:mm").format(
                    "DD/MM/YYYY HH:mm"
                  )}{" "}
                  -{" "}
                  {moment(flight.arriveTime, "DD/MM/YYYY HH:mm").format(
                    "DD/MM/YYYY HH:mm"
                  )}
                  )
                </div>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-pink-600 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
