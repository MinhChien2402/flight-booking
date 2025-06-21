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
  createAircraft,
  deleteAircraft,
  getListAircrafts,
  updateAircraft,
} from "../../thunk/aircraftThunk"; // Đổi từ planeThunk
// Styles, images, icons
import { BiArrowBack } from "react-icons/bi";

export default function AircraftsPage() {
  //#region Declare Hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const { aircrafts, loading, error } = useSelector(
    // Đổi từ planes
    (state) => state.aircraft // Đổi từ plane
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
  const [formError, setFormError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getListAircrafts()); // Đổi từ getListPlanes
  }, [dispatch]);
  //#endregion Implement Hook

  //#region Handle Function
  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý mở modal tạo máy bay
  const handleCreate = () => {
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

  // Xử lý mở modal chỉnh sửa máy bay
  const handleEdit = (aircraft) => {
    setFormData({
      id: aircraft.id,
      name: aircraft.name || "",
      code: aircraft.code || "",
      additionalCode: aircraft.additionalCode || "",
    });
    setIsEditMode(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Xử lý xóa máy bay
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this aircraft?")) {
      try {
        await dispatch(deleteAircraft(id)).unwrap(); // Đổi từ deletePlane
        await dispatch(getListAircrafts()).unwrap(); // Đổi từ getListPlanes
        toast.success("Aircraft deleted successfully!");
      } catch (error) {
        console.error("Lỗi xóa máy bay:", error);
        setFormError(
          error?.message ||
            error?.data?.message ||
            "Không thể xóa máy bay do có lịch trình bay liên kết với máy bay này."
        );
        toast.error("Failed to delete aircraft!");
      }
    }
  };

  // Xử lý submit form (tạo hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const aircraftData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      additionalCode: formData.additionalCode
        ? formData.additionalCode.trim().toUpperCase()
        : null,
    };

    const validationError = validateFormData(aircraftData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateAircraft({ id: formData.id, aircraftData })
        ).unwrap(); // Đổi từ updatePlane
      } else {
        await dispatch(createAircraft(aircraftData)).unwrap(); // Đổi từ createPlane
      }
      await dispatch(getListAircrafts()).unwrap(); // Đổi từ getListPlanes
      setIsModalOpen(false);
      toast.success(
        isEditMode
          ? "Aircraft updated successfully!"
          : "Aircraft created successfully!"
      );
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.";
      setFormError(errorMessage);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} aircraft!`);
    }
  };

  // Kiểm tra dữ liệu form
  const validateFormData = (data) => {
    if (!data.name.trim()) {
      return "The aircraft name must not leave blank.";
    }
    if (data.name.length > 100) {
      return "The aircraft's name must not exceed 100 characters.";
    }
    if (!data.code.trim()) {
      return "The aircraft code is not allowed to leave.";
    }
    if (data.code.length !== 4) {
      return "The aircraft code must have 4 characters.";
    }
    // Kiểm tra trùng lặp code
    const isCodeDuplicate = aircrafts.some(
      (aircraft) =>
        aircraft.code.toUpperCase() === data.code.toUpperCase() &&
        (isEditMode ? aircraft.id !== formData.id : true)
    );
    if (isCodeDuplicate) {
      return "The aircraft code has existed. Please choose another code.";
    }
    if (data.additionalCode && data.additionalCode.length !== 3) {
      return "Additional code must have 3 characters.";
    }
    return null;
  };

  const columns = ["Id", "Name", "Code", "Additional Code", "Actions"];

  const filteredAircrafts = aircrafts.filter((aircraft) =>
    Object.values(aircraft).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formattedData = filteredAircrafts.map((aircraft) => ({
    Id: aircraft.id,
    Name: aircraft.name,
    Code: aircraft.code,
    "Additional Code": aircraft.additionalCode || "",
    Actions: (
      <div className="flex gap-2">
        <Button
          primary
          className="px-3 py-1 rounded"
          onClick={() => handleEdit(aircraft)}
          disabled={loading}
        >
          Edit
        </Button>
        <Button
          danger
          className="px-3 py-1 rounded"
          onClick={() => handleDelete(aircraft.id)}
          disabled={loading}
        >
          Delete
        </Button>
      </div>
    ),
  }));

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  //#endregion Handle Function

  return (
    <div className="flex flex-col min-h-screen">
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
            title="Aircrafts" // Đổi từ Planes
            searchPlaceholder="Search aircrafts..."
            createButtonLabel="Create Aircraft" // Đổi từ Create Plane
            onCreate={handleCreate}
            columns={columns}
            data={formattedData}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Chỉnh sửa máy bay" : "Tạo máy bay mới"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tên máy bay
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                  maxLength={100}
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mã máy bay
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                  maxLength={4}
                  minLength={4}
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mã bổ sung
                </label>
                <input
                  type="text"
                  name="additionalCode"
                  value={formData.additionalCode}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border rounded"
                  maxLength={3}
                  minLength={3}
                  disabled={loading}
                />
              </div>
              {formError && (
                <div className="mb-4 text-red-500 text-sm">{formError}</div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  secondary
                  className="px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  primary
                  className="px-4 py-2 rounded"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isEditMode ? "Cập nhật" : "Tạo"}
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
