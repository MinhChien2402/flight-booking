// Libs
import React from "react";
import { useSelector } from "react-redux"; // Thêm để kiểm tra trạng thái
// Components, Layouts, Pages
import Header from "../../components/header/Header";
import FlightSearchForm from "../../components/flightSearchForm/FlightSearchForm";
import Footer from "../../components/footer/Footer";
// Others
// Styles, images, icons
import airplaneImg from "../../assets/airplane-wallpaper.jpg";

const HomePage = () => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  const { loading: airportsLoading, error: airportsError } = useSelector(
    (state) => state.airport
  );
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div
        className="flex-1 bg-gradient-to-b from-blue-900 to-blue-500 flex flex-col items-center justify-start pt-16 pb-32 relative"
        style={{
          backgroundImage: `url(${airplaneImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40"></div>
        <div className="relative z-10 mb-12">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center">
            Book Your Next Flight
          </h1>
        </div>
        <div className="relative z-20 w-full px-4 overflow-visible">
          {airportsLoading && (
            <p className="text-white text-center">Loading airports...</p>
          )}
          {airportsError && (
            <p className="text-red-200 text-center">
              Error loading airports: {airportsError}
            </p>
          )}
          {!airportsLoading && !airportsError && <FlightSearchForm />}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Us?
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 px-4">
          {[
            {
              title: "Best Prices",
              desc: "We offer competitive prices for all destinations worldwide.",
            },
            {
              title: "24/7 Support",
              desc: "Our team is here to help you with any questions at any time.",
            },
            {
              title: "Easy Booking",
              desc: "Book flights quickly and easily with our user-friendly platform.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-lg shadow-md text-center max-w-sm"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="relative bg-cover bg-center py-20 text-center"
        style={{
          backgroundImage: `url('/airplane-wing.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Flight?
          </h2>
          <p className="text-white mb-6">
            Sign up now and get access to exclusive deals!
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          What Our Customers Say
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 px-4">
          {[
            {
              quote: `"This platform made booking my flight so easy and stress-free!"`,
              name: "John Doe",
            },
            {
              quote: `"I found the best deal on my flight thanks to this site!"`,
              name: "Jane Smith",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 p-6 rounded-xl shadow-md text-center max-w-md w-full flex flex-col justify-between"
            >
              <p className="text-gray-700 italic mb-4">{item.quote}</p>
              <p className="font-semibold text-gray-900 mt-auto">
                – {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
