// Libs
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
// Others
import { registerUser } from "../../thunk/authThunk";
// Styles, images, icons
import airplaneImg from "../../assets/airplane-wallpaper.jpg";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { loading, error } = useSelector((state) => state.auth);
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook
  //#region Handle Function
  const handleRegister = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const newUser = {
      fullName,
      email,
      password,
      role: "customer", // Đảm bảo chỉ tạo tài khoản customer
    };

    try {
      const result = await dispatch(registerUser(newUser)).unwrap();
      toast.success(result.message || "Registered successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(error || "Registration failed.");
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
