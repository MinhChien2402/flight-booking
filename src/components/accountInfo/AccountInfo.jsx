// Libs
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
// Others
import { getUserProfile, updateUserProfile } from "../../thunk/profileThunk";
// Styles, images, icons

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
    try {
      await dispatch(updateUserProfile(editedInfo)).unwrap();
      await dispatch(getUserProfile()).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (status === "loading") return <div>Loading...</div>;
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
            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          ].map(({ label, name, type }) => (
            <div
              key={name}
              className="flex flex-col sm:flex-row sm:items-center"
            >
              <div className="w-36 font-medium text-gray-700 mb-1 sm:mb-0">
                {label}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type={type}
                    name={name}
                    value={editedInfo[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                ) : (
                  <div>{userInfo[name] || ""}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
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
