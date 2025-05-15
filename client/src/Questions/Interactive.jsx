
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Interactive() {
 
  const navigate = useNavigate();;

  return (
    <div className="relative w-screen h-screen flex items-center justify-center text-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="relative w-screen h-screen flex items-center justify-center text-gray-900 overflow-hidden">
        <img
          src="/assets/bg.jpeg"
          alt="Background"
          className="absolute w-full h-full object-cover z-0"
        />

        <div className="absolute w-full h-full bg-black opacity-40"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/questions")}
          className="absolute top-8 left-4 text-white z-30"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Card Container */}
        <div className="z-20 max-w-md w-full px-4">
          <div className="bg-white text-black shadow-xl rounded-2xl py-8 px-6 text-center relative overflow-hidden">
            {/* Success Icon */}
            <div className="flex justify-center mb-5">
              <div className="bg-green-500 rounded-full p-3 shadow-md">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            {/* Main Content */}
            <h2 className="text-2xl font-bold mb-3">Well done!</h2>
            <p className="text-gray-700 font-bold mb-6">
              Congratulations on completing your test.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/payment")}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 text-lg font-medium shadow-md"
            >
              Get My Results
            </button>

            {/* Trust Indicator */}
            <div className="flex justify-center mt-4 text-gray-500 text-sm">
              <div className="flex items-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-1"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secure confirmation
              </div>
            </div>

            {/* Decorative Gradient Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-purple-500 to-green-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}