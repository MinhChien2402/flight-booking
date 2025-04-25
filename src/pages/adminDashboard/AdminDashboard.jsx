// Libs
import React from "react";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Others
// Styles, images, icons

const AdminDashboard = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleNavigate = (item) => {
    navigate(`/${item.toLowerCase()}`);
  };
  //#endregion Handle Function

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Admin Dashboard
          </h1>
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Bookings</p>
              <p className="text-blue-500 text-2xl font-bold">150</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Users</p>
              <p className="text-blue-500 text-2xl font-bold">50</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Flights</p>
              <p className="text-blue-500 text-2xl font-bold">20</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-600">Revenue</p>
              <p className="text-blue-500 text-2xl font-bold">$10000</p>
            </div>
          </div>
          {/* Manage Data Section */}
          <h2 className="text-xl font-semibold mb-4">Manage Data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {["Airlines", "Airports", "Countries", "Planes"].map((item) => (
              <div
                key={item}
                onClick={() => handleNavigate(item)}
                className="bg-white text-center py-4 px-2 rounded-lg border hover:shadow cursor-pointer"
              >
                <p className="text-blue-500 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
