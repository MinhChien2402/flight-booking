// Libs
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Components, Layouts, Pages
// Others
import { updateAirline } from "../../thunk/airlineThunk";
// Styles, images, icons

const ModalAirlineManagement = ({
  isOpen,
  onClose,
  onCreate,
  countries,
  airlineData,
}) => {
  //#region Declare Hook
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { loading, error } = useSelector((state) => state.airline);
  //#endregion Selector

  //#region Declare State
  const [airlineName, setAirlineName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [callsign, setCallsign] = useState("");
  const [status, setStatus] = useState("Active");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    if (airlineData) {
      setAirlineName(airlineData.name || "");
      setCountryId(airlineData.countryId?.toString() || "");
      setCallsign(airlineData.callsign || "");
      setStatus(airlineData.status || "Active");
      const selectedCountry = countries.find(
        (c) => c.id === parseInt(airlineData.countryId)
      );
      setSelectedCountryName(selectedCountry ? selectedCountry.name : "");
    } else {
      setAirlineName("");
      setCountryId("");
      setCallsign("");
      setStatus("Active");
      setSelectedCountryName("");
    }
  }, [airlineData, countries]);
  //#endregion Implement Hook

  //#region Handle Function
  const validateForm = () => {
    if (!airlineName.trim()) {
      toast.error("Airline name is required.");
      return false;
    }
    if (!countryId) {
      toast.error("Please select a country.");
      return false;
    }
    if (!callsign.trim()) {
      toast.error("Callsign is required.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const selectedCountry = countries.find((c) => c.id === parseInt(countryId));
    if (!selectedCountry) {
      toast.error("Selected country not found.");
      return;
    }

    const updatedAirline = {
      id: airlineData.id,
      name: airlineName.trim(),
      countryId: parseInt(countryId),
      callsign: callsign.trim(),
      status: status,
      airlinePlanes:
        airlineData.airlinePlanes?.map((plane) => ({
          airlineId: airlineData.id,
          planeId: plane.planeId || plane.id,
        })) || [],
    };

    try {
      console.log("Updated Airline:", updatedAirline);
      await dispatch(updateAirline(updatedAirline)).unwrap();
      toast.success("Airline updated successfully!");
      onClose();
    } catch (err) {
      toast.error(`Error updating airline: ${err.message || err}`);
    }
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const selectedCountry = countries.find((c) => c.id === parseInt(countryId));
    if (!selectedCountry) {
      toast.error("Selected country not found.");
      return;
    }

    const newAirline = {
      name: airlineName.trim(),
      countryId: parseInt(countryId),
      callsign: callsign.trim(),
      status: status,
      airlinePlanes: [],
    };

    onCreate(newAirline); // Truyền dữ liệu qua onCreate
    onClose(); // Đóng modal sau khi tạo
  };

  const handleCountryChange = (e) => {
    const selectedId = e.target.value;
    setCountryId(selectedId);

    const selectedCountry = countries.find(
      (country) => country.id === parseInt(selectedId)
    );
    setSelectedCountryName(selectedCountry ? selectedCountry.name : "");
  };
  //#endregion Handle Function

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl mb-4">
          {airlineData ? "Edit Airline" : "Create Airline"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Airline Name
          </label>
          <input
            type="text"
            value={airlineName}
            onChange={(e) => setAirlineName(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter airline name"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Country</label>
          <select
            value={countryId}
            onChange={handleCountryChange}
            className="border p-2 rounded w-full"
            disabled={loading}
          >
            <option value="">Select Country</option>
            {countries &&
              countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Callsign</label>
          <input
            type="text"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Enter callsign"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
            disabled={loading}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={airlineData ? handleUpdate : handleCreate}
            className="bg-black text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : airlineData ? "Update" : "Create"}
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ModalAirlineManagement;
