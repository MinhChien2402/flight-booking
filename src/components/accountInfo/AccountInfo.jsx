// Libs
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
// Others
import {
  getUserProfile,
  updateUserProfile,
} from "../../thunk/userProfileThunk";
// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";

const AccountInfo = () => {
  //#region Declare Hook
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { userInfo, status, error } = useSelector((state) => state.user);
  //#endregion Selector

  //#region Declare State
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setEditedInfo({ ...userInfo });
  }, [userInfo]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo({ ...userInfo });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updateUserProfile(editedInfo)).unwrap();
      await dispatch(getUserProfile()).unwrap();
      setIsEditing(false);
      toast.success("Change information successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(`Lỗi: ${error.message || "Update failure"}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (status === "loading" && !loading) return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  //#endregion Handle Function

  return (
    <div className="bg-white rounded-2xl p-10 w-full max-w-4xl mx-auto">
      <div className="text-sm text-gray-800">
        <div className="flex items-center mb-6">
          <span className="text-purple-600 text-2xl mr-2">👤</span>
          <h2 className="text-xl font-bold">Account Information</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phoneNumber", type: "text" },
            {
              label: "Date of Birth",
              name: "dateOfBirth",
              type: "date",
              max: today,
            },
            { label: "Address", name: "address", type: "text" },
            {
              label: "Sex",
              name: "sex",
              type: "select",
              options: [
                { value: "", label: "Select Sex" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ],
            },
            { label: "Age", name: "age", type: "number" },
            {
              label: "Preferred Credit Card",
              name: "preferredCreditCard",
              type: "text",
            },
          ].map(({ label, name, type, max, options }) => (
            <div
              key={name}
              className="flex flex-col sm:flex-row sm:items-center"
            >
              <div className="w-36 font-medium text-gray-700 mb-1 sm:mb-0">
                {label}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  type === "select" ? (
                    <select
                      name={name}
                      value={editedInfo[name] || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                      disabled={loading}
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={editedInfo[name] || ""}
                      onChange={handleChange}
                      max={max}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                      disabled={loading}
                    />
                  )
                ) : (
                  <div>{userInfo[name] || ""}</div>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="w-36 font-medium text-gray-700 mb-1 sm:mb-0">
              Sky Miles
            </div>
            <div>{userInfo.skyMiles || 0}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang lưu..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className={`px-5 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center px-5 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
            >
              <span className="mr-2">🔘</span> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
