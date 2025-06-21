import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import airplaneImg from "../../assets/airplane-wallpaper.jpg"; // Giả định đường dẫn ảnh
import Button from "../button/Button";
import Header from "../header/Header";
import Footer from "../footer/Footer";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((state) => state.authentication);

  // Tự động điều hướng nếu đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      if (role === "admin") {
        navigate("/admin");
        toast.info("Welcome Admin! Redirecting to Admin Dashboard...");
      } else {
        navigate("/search");
        toast.info("Welcome back! Redirecting to flight search...");
      }
    }
  }, [isLoggedIn, role, navigate]);

  const handleGuestSearch = () => {
    navigate("/search");
    toast.info("You are searching as a guest. Login to book flights!");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div
        className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden"
        style={{
          backgroundImage: `url(${airplaneImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-600/50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Travel Buddy
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow">
            Plan your next adventure with ease. Search for flights, book
            tickets, and manage your reservations all in one place.
          </p>
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-xl mx-auto">
            <Button
              primary
              className="w-full md:w-auto py-3 px-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
              onClick={handleGuestSearch}
            >
              Check Flight Availability
            </Button>
            <Button
              className="w-full md:w-auto py-3 px-6 text-lg font-semibold bg-white hover:bg-gray-100 text-blue-600 rounded-lg shadow-md transition"
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button
              className="w-full md:w-auto py-3 px-6 text-lg font-semibold bg-white hover:bg-gray-100 text-blue-600 rounded-lg shadow-md transition"
              onClick={handleRegister}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WelcomePage;
