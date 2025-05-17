import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAirline } from "../../thunk/airlineThunk";

const ModalAirline = ({
  isOpen,
  onClose,
  onCreate,
  countries,
  airlineData,
  onUpdate,
}) => {
  const dispatch = useDispatch();

  const [airlineName, setAirlineName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [callsign, setCallsign] = useState("");
  const [status, setStatus] = useState("Active");
  const [selectedCountryName, setSelectedCountryName] = useState("");

  useEffect(() => {
    if (airlineData) {
      setAirlineName(airlineData.name);
      setCountryId(airlineData.countryId);
      setCallsign(airlineData.callsign);
      setStatus(airlineData.status);
    }
  }, [airlineData]);

  const handleUpdate = async () => {
    if (airlineName && countryId && callsign) {
      const selectedCountry = countries.find(
        (c) => c.id === parseInt(countryId)
      );

      if (!selectedCountry) {
        console.log("Selected country not found.");
        return;
      }

      const updatedAirline = {
        id: airlineData.id,
        name: airlineName,
        countryId: parseInt(countryId),
        callsign: callsign,
        status: status,
        airlinePlanes:
          airlineData.airlinePlanes?.map((plane) => ({
            airlineId: airlineData.id,
            planeId: plane.planeId || plane.id,
          })) || [],
      };

      try {
        console.log("Updated Airline:", updatedAirline);
        await onUpdate(updatedAirline);
        onClose();
      } catch (error) {
        console.error("Error updating airline:", error);
      }
    } else {
      console.log("Fields are required.");
    }
  };

  const handleCreate = () => {
    if (airlineName && countryId && callsign) {
      const selectedCountry = countries.find(
        (c) => c.id === parseInt(countryId)
      );

      if (!selectedCountry) {
        console.log("Selected country not found.");
        return;
      }

      const airlineData = {
        name: airlineName,
        countryId: selectedCountry.id,
        callsign: callsign,
        status: status,
        airlinePlanes: [],
      };

      onCreate(airlineData); // Truyền dữ liệu qua onCreate
      onClose(); // Đóng modal sau khi tạo
    } else {
      console.log("Fields are required.");
    }
  };

  const handleCountryChange = (e) => {
    const selectedId = e.target.value;
    setCountryId(selectedId);

    // Tìm tên quốc gia từ danh sách countries dựa trên ID
    const selectedCountry = countries.find(
      (country) => country.id === parseInt(selectedId)
    );
    setSelectedCountryName(selectedCountry ? selectedCountry.name : "");
  };

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
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Country</label>
          <select
            value={countryId}
            onChange={handleCountryChange}
            className="border p-2 rounded w-full"
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
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={airlineData ? handleUpdate : handleCreate}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {airlineData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAirline;
