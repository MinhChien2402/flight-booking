// Libs
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
// Others
import { loginUser } from "../../thunk/authThunk";
// Styles, images, icons
import airplaneImg from "../../assets/airplane-wallpaper.jpg";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
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
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const userData = {
      email,
      password,
    };

    try {
      const result = await dispatch(loginUser(userData)).unwrap();
      toast.success(result.message || "Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(error || "Invalid email or password.");
    }
  };
  //#endregion Handle Function

  return (
    <div className="flex h-screen">
      {/* Left image side */}
      <div className="w-1/2 hidden md:block">
        <img
          src={airplaneImg}
          alt="Plane View"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right login form side */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
            LOGIN
          </h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
