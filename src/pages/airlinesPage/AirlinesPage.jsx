// Libs
import React from "react";
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
// Others
import { airlineData } from "../../mock/mockData";
// Styles, images, icons

const AirlinesPage = () => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Manage Airlines
          </h1>

          {/* Search and Create Button */}
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search airlines..."
              className="border p-2 rounded w-1/2"
            />
            <button className="bg-black text-white px-4 py-2 rounded">
              Create Airline
            </button>
          </div>

          {/* Table */}
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
                {airlineData.map((airline, index) => (
                  <tr key={airline.id} className="text-center">
                    <td className="py-2 border-b">{index + 1}</td>
                    <td className="py-2 border-b">{airline.name}</td>
                    <td className="py-2 border-b">{airline.country}</td>
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
                    <td className="py-2 border-b">
                      <button className="text-green-500 mr-2">Edit</button>
                      <button className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AirlinesPage;
