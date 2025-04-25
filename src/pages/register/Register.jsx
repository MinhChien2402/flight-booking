// Libs
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// Components, Layouts, Pages
// Others
// Styles, images, icons
import airplaneImg from "../../assets/airplane-wallpaper.jpg";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  const [loading, setLoading] = useState(false);
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const newUser = {
      fullName,
      email,
      password,
      role: "customer",
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      toast.error("User already exists.");
      setLoading(false);
    } else {
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  //#endregion Handle Function

  return (
    <div className="flex h-screen">
      {/* Left side image */}
      <div className="w-1/2 hidden md:block">
        <img
          src={airplaneImg}
          alt="plane"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form className="w-3/4 max-w-md space-y-4" onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold text-center text-blue-600">
            REGISTER
          </h2>

          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-500 transition duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
