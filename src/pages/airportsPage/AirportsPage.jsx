// Libs
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Components, Layouts, Pages
import DataTablePage from "../../components/dataTableAdmin/DataTable";
import Button from "../../components/button/Button";
// Others
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  createAirport,
  deleteAirport,
  getListAirports,
  updateAirport,
} from "../../thunk/airportThunk";
// Styles, images, icons
import { BiArrowBack } from "react-icons/bi";

export default function AirportPage() {
  //#region Declare Hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const {
    data: airportData,
    loading,
    error,
  } = useSelector(
    (state) => state.airports // Đổi từ airports
  );
  //#endregion Selector

  //#region Declare State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    code: "",
    additionalCode: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getListAirports());
  }, [dispatch]);
  //#endregion Implement Hook

  //#region Handle Function
  // Mở modal để tạo sân bay mới
  const handleOpenCreateModal = () => {
    setFormData({
      id: null,
      name: "",
      code: "",
      additionalCode: "",
    });
    setIsEditMode(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa sân bay
  const handleEdit = (airport) => {
    setFormData({
      id: airport.id,
      name: airport.name,
      code: airport.code,
      additionalCode: airport.additionalCode || "",
    });
    setIsEditMode(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFormData = (data) => {
    if (!data.name.trim()) {
      return "The airport name is not allowed to leave.";
    }
    if (data.name.length > 100) {
      return "The airport name must not exceed 100 characters.";
    }
    if (!data.code.trim()) {
      return "The airport code is not allowed to leave.";
    }
    if (data.code.length !== 3) {
      return "The airport code must have 3 characters.";
    }
    // Kiểm tra trùng lặp code trong danh sách hiện tại (trừ chính nó nếu đang edit)
    const isCodeDuplicate = airportData.some(
      (airport) =>
        airport.code.toUpperCase() === data.code.toUpperCase() &&
        (isEditMode ? airport.id !== data.id : true)
    );
    if (isCodeDuplicate) {
      return "The airport code has existed. Please choose another code.";
    }
    if (data.additionalCode && data.additionalCode.length > 50) {
      return "The additional code must not exceed 50 characters.";
    }
    return null;
  };

  // Xử lý submit form (tạo hoặc chỉnh sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Chuẩn hóa dữ liệu gửi đi
    const airportDataToSend = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      additionalCode: formData.additionalCode.trim() || null,
    };

    // Kiểm tra dữ liệu
    const validationError = validateFormData(airportDataToSend);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateAirport({ id: formData.id, airportData: airportDataToSend })
        ).unwrap();
        toast.success("Airport updated successfully!");
      } else {
        await dispatch(createAirport(airportDataToSend)).unwrap();
        toast.success("Airport created successfully!");
      }
      dispatch(getListAirports());
      setIsModalOpen(false); // Đóng modal sau khi thành công
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.title ||
        error?.message ||
        "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.";
      toast.error(errorMessage);
      setFormError(errorMessage);
    }
  };

  // Xử lý xóa sân bay
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this airport?")) {
      try {
        await dispatch(deleteAirport(id)).unwrap();
        toast.success("Airport deleted successfully!");
      } catch (error) {
        console.error("Lỗi xóa sân bay:", error);
        toast.error("Failed to delete airport: " + (error.message || error));
      }
    }
  };

  const columns = ["Id", "Name", "Code", "Additional Code", "Actions"];

  const filteredData = airportData
    .filter((airport) => {
      const term = searchTerm.toLowerCase();
      return (
        airport.id?.toString().toLowerCase().includes(term) ||
        airport.name?.toLowerCase().includes(term) ||
        airport.code?.toLowerCase().includes(term) ||
        airport.additionalCode?.toLowerCase().includes(term)
      );
    })
    .map((airport) => ({
      Id: airport.id,
      Name: airport.name,
      Code: airport.code,
      "Additional Code": airport.additionalCode || "N/A",
      Actions: (
        <div className="flex gap-2">
          <Button
            primary
            className="px-3 py-1 rounded"
            onClick={() => handleEdit(airport)}
          >
            Edit
          </Button>
          <Button
            danger
            className="px-3 py-1 rounded"
            onClick={() => handleDelete(airport.id)}
          >
            Delete
          </Button>
        </div>
      ),
    }));

  const handleSearchChange = (value) => {
    setSearchTerm(value.toLowerCase());
  };
  //#endregion Handle Function

  return (
    <div>
      <Header />
      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[130px] mt-3"
        onClick={() => navigate(-1)}
      >
        <BiArrowBack size={20} />
      </Button>
      <div className="flex-grow bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <DataTablePage
            title="Airports"
            searchPlaceholder="Search airports..."
            createButtonLabel="Create Airport"
            onCreate={handleOpenCreateModal}
            columns={columns}
            data={filteredData}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Airport" : "Create Airport"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Code
                </label>
                <input
                  type="text"
                  name="additionalCode"
                  value={formData.additionalCode}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  disabled={loading}
                />
              </div>
              {formError && (
                <p className="text-red-600 text-sm mb-4">{formError}</p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  secondary
                  className="px-4 py-2 rounded"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  className="px-4 py-2 rounded"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isEditMode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
