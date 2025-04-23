import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function Navbar({ theme, toggleTheme, handleLogout }) {
  return (
    <div
      className={`p-4 flex justify-between items-center ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <span className="text-xl">Admin Dashboard</span>
      <div className="flex items-center">
        <button className="p-2 rounded-md cursor-pointer" onClick={toggleTheme}>
          {theme === "dark" ? (
            <FaSun size={24} color="yellow" />
          ) : (
            <FaMoon size={24} color="gray" />
          )}
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded-md ml-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
