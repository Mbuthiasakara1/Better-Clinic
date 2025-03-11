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
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="assets/Flux_Dev_pls_generate_a_image_my_mental_health_app_for_the_bg__3.jpeg"
        alt="Background"
      />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[30%] text-center px-4 py-10 bg-opacity-50 z-10 ">
        <h1 className="w-full text-2xl md:text-2xl lg:text-3xl font-bold text-[#04ff92] z-10 mb-1">
          Your Journey to Wellness Begins Here
        </h1>
        <p className="w-full text-sm md:text-base lg:text-lg font-semibold text-white">
          You're Not Alone. Support Starts Here. Your mental health journey
          matters. Take our confidential 5-minute assessment to find
          personalized support.
        </p>
        <button
          className="p-3 bg-[#88C090] hover:bg-[#6FA982] text-white font-semibold rounded-xl transition-all duration-300 shadow-md w-full mt-2"
          onClick={() => navigate("/questions")}
        >
          Start Test
        </button>
      </div>
    </div>
  );
}

export default HomePage;
