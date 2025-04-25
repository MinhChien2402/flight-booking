// Libs
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components, Layouts, Pages
import AccountInfo from "../../components/accountInfo/AccountInfo";
import Header from "../../components/header/Header";
import BookedTicketsTable from "../../components/bookedTicketTable/BookedTicketTable";
import Footer from "../../components/footer/Footer";
// Others
import { mockBookedTickets } from "../../mock/mockData";
// Styles, images, icons

const BookingsPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [bookedTickets, setBookedTickets] = useState([]);
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    setBookedTickets(mockBookedTickets);
  }, []);
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Account Info Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <AccountInfo />
        </div>

        {/* Booked Tickets Section */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Your Booked Tickets
          </h2>
          <BookedTicketsTable tickets={mockBookedTickets} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingsPage;
