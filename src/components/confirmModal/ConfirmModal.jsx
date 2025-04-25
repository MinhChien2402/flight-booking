// Libs
import React from "react";
// Components, Layouts, Pages
// Others
// Styles, images, icons

const ConfirmModal = ({ isOpen, onCancel, onConfirm }) => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  if (!isOpen) return null;
  //#endregion Handle Function

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Xác nhận đặt vé</h2>
        <p className="mb-6">
          Bạn đã chắc chắn với những thông tin bạn đã điền?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 text-gray-800 py-1 px-4 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-pink-600 text-white py-1 px-4 rounded"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
