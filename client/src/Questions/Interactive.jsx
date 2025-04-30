import React from "react";
import { useNavigate } from "react-router-dom";

function Interactive() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen flex items-center justify-center text-gray-900 overflow-hidden">
      {/* Background Image */}
      <img
        src="/assets/bg.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover z-0"
      />
      
      
      {/* Back Button */}
      <button 
      onClick={()=>navigate("/questions")}
      className="absolute top-12 left-4 text-white z-30">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Card Container */}
      <div className="z-20 max-w-md w-full px-6">
        <div className="bg-white text-black shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden">
          {/* Decorative Elements - Top corners */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-green-50 rounded-br-full opacity-50"></div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full opacity-50"></div>
          
          {/* Success Icon - Improved */}
          <div className="inline-flex items-center justify-center bg-green-500 rounded-full p-5 mb-6 shadow-lg">
            <img
              src="/assets/checked.png"
              alt="Checkmark"
              className="w-10 h-10"
            />
          </div>

          {/* Main Content */}
          <h2 className="text-3xl font-bold mb-4">Well done!</h2>
          
          <p className="mb-8 text-gray-600">
            Do you want to confirm your answers?<br />
            You will not be able to edit them after you continue.
          </p>

          {/* Button with enhanced styling */}
          <button
            onClick={() => navigate("/payment")}
            className="w-full bg-purple-600 text-white px-6 py-4 rounded-full hover:bg-purple-700 transition duration-300 text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Get My Results
          </button>
          
          {/* Decorative Element - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-purple-500 to-green-400"></div>
        </div>
        
        {/* Trust indicators */}
        <div className="flex justify-center mt-4 text-white text-sm ">
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure confirmation
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interactive;