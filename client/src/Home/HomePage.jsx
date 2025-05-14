/* eslint-disable no-unused-vars */

import React from "react";
import { useState } from "react";
import useStore from "../../Store";
import Questions from "../Questions/Questions";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { isPressed, setIsPressed } = useStore();
  const navigate = useNavigate();
  
  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      {/* Background image */}
      <img
        src="/assets/bg.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      
      {/* Overlay for better text contrast */}
      <div className="absolute w-full h-full bg-black/35"></div>
      
      {/* Content container without the black background */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[50%] text-center px-8 py-10">
        {/* Title with stronger text effect */}
        <h1 className="w-full text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 tracking-tight mb-2 drop-shadow-lg animate-pulse-slow">
        USICHIZI
        </h1>
        
        {/* Description with better contrast */}
        <p className="w-full text-base md:text-xl lg:text-2xl font-semibold text-white leading-relaxed mb-3 drop-shadow-md">
          Your <span className="font-bold text-emerald-300 drop-shadow-md">mental wellness</span> journey matters.
          <br className="hidden md:block" /> 
          Take our <span className="font-bold text-emerald-300 drop-shadow-md">confidential 5-minute</span> assessment 
          to find <span className="font-bold text-emerald-300 drop-shadow-md">personalized</span> support.
        </p>
        
        {/* Button with improved visibility */}
        <button
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white text-lg font-bold rounded-full transition-all duration-300 shadow-lg w-[80%] md:w-[60%] lg:w-[50%] mt-4 transform hover:-translate-y-1 hover:shadow-emerald-500/50 hover:shadow-lg border-2 border-emerald-400/30"
          onClick={() => navigate("/questions")}
        >
          Begin Your Journey
        </button>
        
        {/* Trust indicators with improved visibility */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-white">
          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1 text-emerald-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm font-medium">Confidential</span>
          </div>
          <div className="flex items-center bg-black/30 px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1 text-emerald-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm font-medium">Personalized</span>
          </div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
      `}</style>
    </div>
  );
}

export default HomePage;