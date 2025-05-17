// Libs
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import DataTablePage from "../../components/dataTableAdmin/DataTable";
// Others
import {
  createPlane,
  deletePlane,
  getListPlanes,
  updatePlane,
} from "../../thunk/planeThunk";
// Styles, images, icons

export default function PlanePage() {
  //#region Declare Hook
  const dispatch = useDispatch();
  const { planes, loading, error } = useSelector((state) => state.plane);
  //#endregion Declare Hook

  //#region Selector
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
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getListPlanes());
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
  const handleEdit = (plane) => {
    setFormData({
      id: plane.id,
      name: plane.name || "",
      code: plane.code || "",
      additionalCode: plane.additionalCode || "",
    });
    setIsEditMode(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Xử lý xóa máy bay
  const handleDelete = async (id) => {
    try {
      await dispatch(deletePlane(id)).unwrap();
      await dispatch(getListPlanes()).unwrap();
    } catch (error) {
      console.error("Lỗi xóa máy bay:", error);
      setFormError(
        error?.message ||
          error?.data?.message ||
          "Không thể xóa máy bay do có hãng hàng không liên kết với máy bay này."
      );
    }
  };

  // Xử lý submit form (tạo hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const planeData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      additionalCode: formData.additionalCode
        ? formData.additionalCode.trim().toUpperCase()
        : null,
    };

    const validationError = validateFormData(planeData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(updatePlane({ id: formData.id, planeData })).unwrap();
      } else {
        await dispatch(createPlane(planeData)).unwrap();
      }
      await dispatch(getListPlanes()).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.";
      setFormError(errorMessage);
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
    const isCodeDuplicate = planes.some(
      (plane) =>
        plane.code.toUpperCase() === data.code.toUpperCase() &&
        (isEditMode ? plane.id !== formData.id : true)
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

  const formattedData = planes.map((plane) => ({
    Id: plane.id,
    Name: plane.name,
    Code: plane.code,
    "Additional Code": plane.additionalCode || "",
    Actions: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(plane)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(plane.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }));

  //#endregion Handle Function

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <DataTablePage
          title="Planes"
          searchPlaceholder="Search planes..."
          createButtonLabel="Create Plane"
          onCreate={handleCreate}
          columns={columns}
          data={formattedData}
          loading={loading}
          error={error}
        />
      </main>

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
                />
              </div>
              {formError && (
                <div className="mb-4 text-red-500 text-sm">{formError}</div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
