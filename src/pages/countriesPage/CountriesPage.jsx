// Libs
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import DataTablePage from "../../components/dataTableAdmin/DataTable";
// Others
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
// Others
import {
  createCountry,
  deleteCountry,
  getListCountries,
  updateCountry,
} from "../../thunk/countryThunk";
// Styles, images, icons
import { BiArrowBack } from "react-icons/bi";

export default function CountryPage() {
  //#region Declare Hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const { countries, loading, error } = useSelector((state) => state.country);
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
    dispatch(getListCountries());
  }, [dispatch]);
  //#endregion Implement Hook

  //#region Handle Function
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

  // Mở modal để chỉnh sửa quốc gia
  const handleEdit = (country) => {
    const newFormData = {
      id: country.id,
      name: country.name || "",
      code: country.code || "",
      additionalCode: country.additionalCode || "",
    };
    setFormData(newFormData);
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
      return "The country's name is not allowed to leave.";
    }
    if (data.name.length > 100) {
      return "The country's name must not be more than 100 characters.";
    }
    if (!data.code.trim()) {
      return "The country code is not allowed to leave.";
    }
    if (data.code.length !== 2) {
      return "The national code must have 2 characters.";
    }
    // Kiểm tra trùng lặp code
    const isCodeDuplicate = countries.some(
      (country) =>
        country.code.toUpperCase() === data.code.toUpperCase() &&
        (isEditMode ? country.id !== formData.id : true)
    );
    if (isCodeDuplicate) {
      return "The country code has existed. Please choose another code.";
    }
    if (data.additionalCode && data.additionalCode.length !== 3) {
      return "Additional code must have 3 characters.";
    }
    return null;
  };

  // Xử lý submit form (tạo hoặc chỉnh sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Chuẩn hóa dữ liệu gửi đi
    const countryData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      additionalCode: formData.additionalCode
        ? formData.additionalCode.trim()
        : "",
    };

    // Kiểm tra dữ liệu
    const validationError = validateFormData(countryData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      if (isEditMode) {
        // Cập nhật quốc gia
        await dispatch(
          updateCountry({ id: formData.id, countryData })
        ).unwrap();
      } else {
        // Tạo quốc gia mới
        await dispatch(createCountry(countryData)).unwrap();
      }
      // Lấy lại danh sách quốc gia để làm mới bảng
      await dispatch(getListCountries()).unwrap();
      setIsModalOpen(false); // Đóng modal sau khi thành công
    } catch (error) {
      // Hiển thị thông báo lỗi chi tiết từ API
      const errorMessage =
        error?.message ||
        error?.title ||
        error?.data?.message ||
        "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng kiểm tra dữ liệu và thử lại.";
      setFormError(errorMessage);
    }
  };

  // Xử lý xóa quốc gia
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCountry(id)).unwrap();
      await dispatch(getListCountries()).unwrap();
    } catch (error) {
      setFormError(
        error?.message ||
          error?.data?.message ||
          "It is impossible to delete the country due to the relevant data. Please check and try again."
      );
    }
  };

  const columns = ["Id", "Name", "Code", "Additional Code", "Actions"];

  const formattedData = countries.map((item) => ({
    Id: item.id,
    Name: item.name,
    Code: item.code,
    "Additional Code": item.additionalCode || "",
    Actions: (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(item)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(item.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  }));

  const filteredCountries = countries.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
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
            title="Countries"
            searchPlaceholder="Search countries..."
            createButtonLabel="Create Country"
            onCreate={handleOpenCreateModal}
            columns={columns}
            data={formattedData}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit" : "Create"}
            </h2>
            {formError && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {formError}
              </div>
            )}
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
                  maxLength={100}
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
                  maxLength={2}
                  minLength={2}
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
                  maxLength={3}
                  minLength={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditMode ? "Update" : "Create"}
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
