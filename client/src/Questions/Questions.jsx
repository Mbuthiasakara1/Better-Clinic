/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch questions from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/questions")
      .then((resp) => setQuestions(resp.data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleoptionClick = () => {
    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        navigate("/register");
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }, 500);
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="assets/Flux_Dev_pls_generate_a_image_my_mental_health_app_for_the_bg__3.jpeg"
        alt="Background"
      />
      <div className="absolute  left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[30%] text-center px-4 py-10 bg-opacity-50 z-10">
        <div className="h-fill w-[30] rounded-3xl flex justify-center items-center bg-gradient-to-br from-[#88C090] to-[#6FA982] p-4">
          <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full h-fill text-center border border-green-300">
            {questions.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-green-800 mb-6">
                  {questions[currentQuestionIndex].question_text}
                </h2>
                <div className="flex flex-col space-y-4">
                  {questions[currentQuestionIndex]?.options?.map(
                    (option, index) => (
                      <button
                        key={index}
                        className="p-3 bg-[#88C090] hover:bg-[#6FA982] text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                        onClick={() => handleoptionClick()}
                      >
                        {option.text}
                      </button>
                    )
                  )}
                </div>
              </>
            ) : (
              <h2 className="text-2xl font-semibold text-green-800 mb-6">
                Loading...
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
