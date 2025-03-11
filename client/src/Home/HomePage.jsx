import React from "react";

function HomePage() {
  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      {/* Background Image */}
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="assets/dan-meyers-hluOJZjLVXc-unsplash.jpg"
        alt="Background"
      />

      {/* Content */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[30%] text-center px-4 py-10 bg-opacity-50 z-10 ">
        <h1 className="w-full text-2xl md:text-2xl lg:text-3xl font-bold text-white z-10 mb-1">
          Your Journey to Wellness Begins Here
        </h1>
        <p className="w-full text-sm md:text-base lg:text-lg font-semibold">
          You're Not Alone. Support Starts Here. Your mental health journey
          matters. Take our confidential 5-minute assessment to find
          personalized support.
        </p>

        <button className="mt-6 rounded-2xl bg-blue-300 text-black p-3 font-extrabold w-full max-w-xs">
          Start Test
        </button>
      </div>
    </div>
  );
}

export default HomePage;
