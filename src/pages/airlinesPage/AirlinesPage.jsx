// Libs
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Button from "../../components/button/Button";
// Others
import { useDispatch, useSelector } from "react-redux";
import {
  createAirline,
  deleteAirline,
  getAirlines,
  updateAirline,
} from "../../thunk/airlineThunk";
import ModalAirline from "../../components/modalAirline/ModalAirline";
// Styles, images, icons
import { BiArrowBack } from "react-icons/bi";

const AirlinesPage = () => {
  //#region Declare Hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  const { list, loading, error, createLoading, createError } = useSelector(
    (state) => state.airline
  );
  //#endregion Selector

  //#region Declare State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { countries } = useSelector((state) => state.country);
  const [airlineData, setAirlineData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    dispatch(getAirlines());
  }, [dispatch]);
  //#endregion Implement Hook

  //#region Handle Function
  const handleCreateAirline = async (airlineData) => {
    try {
      await dispatch(createAirline(airlineData)).unwrap();
      dispatch(getAirlines());
    } catch (error) {
      console.error("Error creating airline:", error);
    }
  };

  const handleUpdateAirline = async (updatedAirline) => {
    try {
      await dispatch(updateAirline(updatedAirline)).unwrap();
      dispatch(getAirlines());
    } catch (error) {
      console.error("Error updating airline:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this airline?")) {
      try {
        await dispatch(deleteAirline(id)).unwrap();
        dispatch(getAirlines());
      } catch (error) {
        console.error("Error deleting airline:", error);
      }
    }
  };

  const filteredList = list.filter(
    (airline) =>
      airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airline.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airline.country?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //#endregion Handle Function

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Button
        className="text-xs px-2 py-1 w-[100px] ml-[100px] mt-3"
        onClick={() => navigate(-1)}
      >
        <BiArrowBack size={20} />
      </Button>

      <div className="flex-grow bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Airlines</h1>

          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search airlines..."
              className="border p-2 rounded w-1/2"
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Create Airline
            </button>
          </div>

          {loading && (
            <div className="text-center text-xl text-gray-500">Loading...</div>
          )}
          {error && (
            <div className="text-center text-xl text-red-500">
              Error: {error.message || JSON.stringify(error)}
            </div>
          )}

          {createLoading && (
            <div className="text-center text-xl text-gray-500">
              Creating Airline...
            </div>
          )}
          {createError && (
            <div className="text-center text-xl text-red-500">
              Error: {createError.message || JSON.stringify(createError)}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 border-b">Sl</th>
                    <th className="py-2 border-b">Name</th>
                    <th className="py-2 border-b">Country</th>
                    <th className="py-2 border-b">Callsign</th>
                    <th className="py-2 border-b">Status</th>
                    <th className="py-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((airline, index) => (
                    <tr key={airline.id} className="text-center">
                      <td className="py-2 border-b">{index + 1}</td>
                      <td className="py-2 border-b">{airline.name}</td>
                      <td className="py-2 border-b">
                        {airline.country?.name || "N/A"}
                      </td>
                      <td className="py-2 border-b">{airline.callsign}</td>
                      <td
                        className={`py-2 border-b ${
                          airline.status === "Active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {airline.status}
                      </td>
                      <td className="py-2 border-b ">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => {
                            setAirlineData(airline);
                            setIsModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => handleDelete(airline.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ModalAirline
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAirlineData(null);
        }}
        onCreate={handleCreateAirline}
        countries={countries}
        airlineData={airlineData}
        onUpdate={handleUpdateAirline}
      />
      <Footer />
    </div>
  );
};

export default AirlinesPage;
