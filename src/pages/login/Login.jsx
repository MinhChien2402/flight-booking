// Libs
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// Components, Layouts, Pages
// Others
// Styles, images, icons
import "react-toastify/dist/ReactToastify.css";
import airplaneImg from "../../assets/airplane-wallpaper.jpg";

const LoginPage = () => {
  //#region Declare Hook
  const navigate = useNavigate();
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const isAdminExists = users.some(
      (user) => user.email === "admin@example.com"
    );

    if (!isAdminExists) {
      const defaultAdmin = {
        fullName: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      };
      users.push(defaultAdmin);
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);
  //#endregion Implement Hook

  //#region Handle Function
  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      toast.success("Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", foundUser.role);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error("Invalid email or password.");
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
            >
              Login
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
