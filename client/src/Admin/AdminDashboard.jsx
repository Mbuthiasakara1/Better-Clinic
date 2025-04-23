/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import DashBoard from "./DashBoard";
import LoginForm from "./Login";


function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/admin/login",
        {
          username,
          password,
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false };
    }
  };

  const handleLogout = async () => {
    await axios.post(
      "http://127.0.0.1:5000/api/admin/logout",
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={
        theme === "dark" ? "bg-gray-900 text-black" : "bg-gray-100 text-black"
      }
    >
      {isAuthenticated ? (
        <DashBoard
          theme={theme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default AdminDashboard;
