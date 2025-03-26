
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch questions from API
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/questions")
      .then((resp) => setQuestions(resp.data))
      .catch((error) => console.error("Error fetching questions:", error));
    setLoading(false);
  }, []);

  // Reset selected option when moving to a new question
  useEffect(() => {
    setSelectedOptionIndex(null);
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    // Only proceed if an option is selected
    if (selectedOptionIndex !== null) {
      setTimeout(() => {
        if (currentQuestionIndex === questions.length - 1) {
          navigate("/register");
        } else {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
      }, 200);
    }
  };

  const handleMoveBack = () => {
    setTimeout(() => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      }
    }, 200);
  };

  const handleOptionClick = (index) => {
    setSelectedOptionIndex(index);
    handleResponse(index);
  };

  function handleResponse(optionIndex) {
    // You can send the response to your backend here
    // axios.post("http://localhost:5000/api/responses", {
    //   questionId: questions[currentQuestionIndex].id,
    //   optionId: questions[currentQuestionIndex].options[optionIndex].id
    // });
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/Flux_Dev_pls_generate_a_image_my_mental_health_app_for_the_bg__3.jpeg"
        alt="Background"
      />

      <div className="absolute left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[50%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4">
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-green-300">
          {questions.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold text-green-800 mb-6">{`${currentQuestionIndex + 1} of ${questions.length}`}</h2>
              <h2 className="text-2xl font-semibold text-green-900 mb-6">
                {questions[currentQuestionIndex].question_text}
              </h2>
              <div className="flex flex-col space-y-3">
                {questions[currentQuestionIndex]?.options?.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`p-3 ${
                        selectedOptionIndex === index
                          ? "bg-[#00853E] text-white" // Selected option color
                          : "bg-[#4a9e57] hover:bg-[#8CB9A5] text-white"
                      } font-semibold rounded-xl transition-all duration-300 shadow-md`}
                      onClick={() => handleOptionClick(index)}
                    >
                      {option.text}
                    </button>
                  )
                )}
                <div className="flex justify-between mt-2 w-full max-w-xs mx-auto overflow-hidden">
                  <button
                    className="w-20 h-10 bg-[#7C9D8D] hover:bg-[#6A8A7A] text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                    onClick={handleMoveBack}
                    disabled={currentQuestionIndex === 0}
                  >
                    Back
                  </button>
                  <button
                    className={`w-20 h-10 ${
                      selectedOptionIndex !== null
                        ? "bg-[#2E7D57] hover:bg-[[#256b4a]" // Enabled Next button
                        : "bg-[#A0A5A6] text-gray-400 cursor-not-allowed" // Disabled Next button
                    } text-white font-semibold rounded-xl transition-all duration-300 shadow-md`}
                    onClick={handleNextQuestion}
                    disabled={selectedOptionIndex === null}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : loading ? (
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              Loading questions...
            </h2>
          ) : (
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              No questions
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Questions;