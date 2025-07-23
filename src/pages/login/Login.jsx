// Libs
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// Components, Layouts, Pages
// Others
import { loginUser } from "../../thunk/authenticationThunk";
// Styles, images, icons
import airplaneImg from "../../assets/airplane-wallpaper.jpg";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion Declare Hook

  //#region Selector
  const { loading, error } = useSelector((state) => state.authentication);
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    const userData = { email, password };
    try {
      const result = await dispatch(loginUser(userData)).unwrap();
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", result.user.role);
      toast.success(result.message || "Login successful!");

      // Kiểm tra pending session từ tìm kiếm
      const pendingParams = sessionStorage.getItem("pendingSearchParams");
      if (pendingParams) {
        const searchParams = JSON.parse(pendingParams);
        // Xóa session sau khi đọc để tránh lặp
        sessionStorage.removeItem("pendingSearchParams");
        sessionStorage.removeItem("pendingAction");
        sessionStorage.removeItem("pendingTicketId");
        sessionStorage.removeItem("pendingSelections");

        // Redirect về trang kết quả với state
        setTimeout(
          () => navigate("/search-results", { state: { searchParams } }),
          1000
        );
      } else {
        // Nếu không có pending, redirect về trang tìm kiếm mặc định
        setTimeout(() => navigate("/search"), 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Invalid email or password.");
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
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
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
