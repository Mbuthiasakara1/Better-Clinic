/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SecondQuestions from "./SecondQuestions";
import useStore from "../../Store";
import lottie from "lottie-web";
import loader from "../assets/loader.json";
import Emojis from "./Emojis";
import { toast } from "react-hot-toast";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFinalStep, setShowFinalStep] = useState(false);
  const [showSecondQuestions, setShowSecondQuestions] = useState(false);
  const [responses, setResponses] = useState([]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    session_id: "",
    question_id: "",
    response_value: [],
  });
  const [animationInstance, setAnimationInstance] = useState(null);
  const navigate = useNavigate();
  const { Session, setSession, user } = useStore();
  const user_id = localStorage.getItem("user_id");
  const progressRef = useRef(null);
  // Lottie animation setup

  // Fetch questions from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsSuccessful(false);
    }, 60000);
    axios
      .get("http://127.0.0.1:5000/api/questions")
      .then((resp) => {
        if (resp.data.length > 0) {
          setQuestions(resp.data);
          setIsSuccessful(true);
        } else {
          setIsSuccessful(false);
        }
        setIsLoading(false);
        clearTimeout(timer);
      })
      .catch((error) => {
        setIsSuccessful(false);
        setIsLoading(true); // Keep loading animation if API fails
        console.error("Error fetching questions:", error);
      });
    return () => clearTimeout(timer);
  }, []);

 // Reset selected option when moving to a new question
 useEffect(() => {
   setSelectedOption(null);
 }, [currentQuestionIndex]);
 const getButtonStyles = (index, isSelected) => {
   const styles = [
     {
       selected: "bg-blue-500 text-white",
       unselected: "border-blue-500 hover:bg-blue-500",
     },
     {
       selected: "bg-yellow-500 text-white",
       unselected: "border-yellow-500 hover:bg-yellow-500",
     },
     {
       selected: "bg-purple-500 text-white",
       unselected: "border-purple-500 hover:bg-purple-500",
     },
     {
       selected: "bg-green-500 text-white",
       unselected: "border-green-500 hover:bg-green-500",
     },
   ];
   const style = styles[index % styles.length];
   return isSelected ? style.selected : style.unselected;
 };
 const handleOptionClick = (index) => {
   const selectedQuestion = questions[currentQuestionIndex];
   setSelectedOption(index);
   setFormData({
     ...formData,
     session_id: Session,
     question_id: selectedQuestion.id,
     response_value: selectedQuestion.options[index].text,
   });
   // Append new response instead of replacing existing ones
   setResponses((prevResponses) => [
     ...prevResponses,
     {
       question_id: selectedQuestion.id,
       selected_option: selectedQuestion.options[index].text,
     },
   ]);
 };
 const handleNextQuestion = async () => {
   if (currentQuestionIndex === questions.length - 1) {
     setShowFinalStep(true);
   } else {
    const nextIndex =currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)
    setSelectedOption(null)
    //  setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    //  setSelectedOption(null);

    
   }
 };
 const handleMoveBack = () => {
   if (currentQuestionIndex > 0) {
    const prevIndex =currentQuestionIndex -1
     setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
     setSelectedOption(null);
   }
 };
 async function handleResponse(sessionId) {
   const currentSessionId = sessionId || Session;
   if (!currentSessionId) {
     console.error("Error: No session ID found before submitting responses.");
     return;
   }
   console.log("Submitting responses with session ID:", currentSessionId);
   console.log("Responses:", responses);
   try {
     await axios.post("http://127.0.0.1:5000/api/responses", {
       session_id: currentSessionId,
       responses: responses,
     });
     console.log("Responses sent successfully:", responses);
     navigate('/interactive')
   } catch (error) {
     console.error("Error submitting responses:", error);
   }
 }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        // className="absolute w-full h-full object-cover opacity-90"
        src="/assets/bg.jpeg"
        alt="Background"
        className="absolute w-full h-full object-cover"
      />

      {/* Stronger overlay for better text contrast */}
      <div className="absolute w-full h-full bg-black/40"></div>

      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4">
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center  flex flex-col justify-center">
          {showSecondQuestions ? (
            <SecondQuestions handleResponse={handleResponse} />
          ) : showFinalStep ? (
            <>
              <div className="my-4 w-full">
                <Emojis />
              </div>
              <button
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                onClick={() => setShowSecondQuestions(true)}
              >
                Continue
              </button>
            </>
          ) : isloading ? (
            <div className=" w-24 h-24 flex justify-center items-center"></div>
          ) : !isSuccessful ? (
            <div className="flex flex-col items-center justify-center">
              <div className="container w-24 h-24"></div>
              <p className="mt-4 text-red-600">
                Failed to load questions. Please try again later.
              </p>
            </div>
          ) : questions.length > 0 ? (
            <>
              <h2 className="text-1xl font-semibold text-green-700">{`${
                currentQuestionIndex + 1
              } of ${questions.length}`}</h2>
              <h2 className="text-2xl font-semibold text-green-800 mb-6 leading relaxed">
                {questions[currentQuestionIndex].question_text}
              </h2>
              <div className="flex flex-col space-y-3">
                {questions[currentQuestionIndex]?.options?.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`p-3 rounded-xl transition-all duration-300 shadow-md font-semibold text-black border-2 ${
                        selectedOption === index
                          ? getButtonStyles(index, true)
                          : `${getButtonStyles(
                              index,
                              false
                            )} text-gray-800 hover:text-white`
                      }`}
                      onClick={() => handleOptionClick(index)}
                    >
                      {option.text}
                    </button>
                  )
                )}

                <div className="flex justify-between mt-6 w-full">
                  <button
                    className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      currentQuestionIndex === 0
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-md"
                    }`}
                    onClick={handleMoveBack}
                    disabled={currentQuestionIndex === 0}
                  >
                    {currentQuestionIndex > 0 && (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    )}
                    Back
                  </button>

                  <button
                    className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      selectedOption !== null
                        ? "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 shadow-lg"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "Finish"
                      : "Next"}
                    {selectedOption !== null &&
                      currentQuestionIndex < questions.length - 1 && (
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                  </button>
                </div>
                </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Questions;
