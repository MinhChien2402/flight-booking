// Libs
import React, { useEffect, useState } from "react";
// Components, Layouts, Pages
import DataTablePage from "../../components/dataTableAdmin/DataTable";
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

export default function AirportPage() {
  //#region Declare Hook
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const {
    data: airportData,
    loading,
    error,
  } = useSelector((state) => state.airports);
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
      additionalCode: airport.additionalCode,
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
        (isEditMode ? airport.id !== formData.id : true)
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
    const airportData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      additionalCode: formData.additionalCode
        ? formData.additionalCode.trim()
        : "",
    };

    // Kiểm tra dữ liệu
    const validationError = validateFormData(airportData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEditMode) {
        // Cập nhật sân bay

        await dispatch(
          updateAirport({ id: formData.id, airportData })
        ).unwrap();
      } else {
        // Tạo sân bay mới
        await dispatch(createAirport(airportData)).unwrap();
      }
      // Lấy lại danh sách sân bay để làm mới bảng
      await dispatch(getListAirports()).unwrap();
      setIsModalOpen(false); // Đóng modal sau khi thành công
    } catch (error) {
      // Hiển thị thông báo lỗi chi tiết từ API
      const errorMessage =
        error?.data?.message ||
        error?.title ||
        error?.message ||
        "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.";
      setFormError(errorMessage);
    }
  };

  // Xử lý xóa sân bay
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAirport(id)).unwrap();
    } catch (error) {
      console.error("Lỗi xóa sân bay:", error);
    }
  };

  const columns = ["Id", "Name", "Code", "Additional Code", "Actions"];

  const formattedData = airportData.map((airport) => ({
    Id: airport.id,
    Name: airport.name,
    Code: airport.code,
    "Additional Code": airport.additionalCode,
    Actions: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(airport)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(airport.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }));
  //#endregion Handle Function

  return (
    <div>
      <Header />
      <DataTablePage
        title="Airports"
        searchPlaceholder="Search airports..."
        createButtonLabel="Create Airport"
        onCreate={handleOpenCreateModal}
        columns={columns}
        data={formattedData}
        loading={loading}
        error={error}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Chỉnh sửa sân bay" : "Tạo sân bay mới"}
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
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditMode ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
