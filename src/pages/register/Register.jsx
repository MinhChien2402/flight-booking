// Libs
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
// Others
import { registerUser } from "../../thunk/authenticationThunk"; // Đổi từ authThunk
// Styles, images, icons
import airplaneImg from "../../assets/airplane-wallpaper.jpg";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { loading, error } = useSelector((state) => state.authentication); // Đổi từ auth
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleRegister = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const fullName = e.target.fullName?.value?.trim() || null; // Tùy chọn

    if (!email || !password) {
      toast.error("Please fill in required fields: Email and Password.");
      return;
    }

    const newUser = {
      email,
      password,
      fullName,
      role: "customer", // Mặc định là customer
      address: null,
      phoneNumber: null,
      PreferredCreditCard: null,
      sex: null,
      age: null,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("Registering user with data:", newUser);
    }

    try {
      const result = await dispatch(registerUser(newUser)).unwrap();
      if (process.env.NODE_ENV === "development") {
        console.log("Registration result:", result);
      }
      toast.success(result.message || "Registration successful!");
      setTimeout(() => navigate("/login"), 1000); // Delay để hiển thị toast
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };
  //#endregion Handle Function

  return (
    <div className="flex h-screen">
      {/* Left side image */}
      <div className="w-1/2 hidden md:block">
        <img
          src={airplaneImg}
          alt="Plane"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form className="w-3/4 max-w-md space-y-4" onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold text-center text-blue-600">
            REGISTER
          </h2>

          <div>
            <label className="block text-gray-700">Full Name (Optional)</label>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700">Email *</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password *</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

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
          <p className="text-center text-xs text-gray-500">
            Additional details (address, phone, etc.) can be updated in your
            profile after registration.
          </p>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
