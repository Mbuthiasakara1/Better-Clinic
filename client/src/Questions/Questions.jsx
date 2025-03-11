/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useStore from "../../Store";
import { useNavigate } from "react-router-dom";
function Questions() {
  const [questions, setQuestions] = useState([
    {
      category: "Stress Management",
      question: "How often do you feel overwhelmed by daily tasks?",
      points: 5,
      answers: [
        { label: "Rarely", score: 1 },
        { label: "Sometimes", score: 3 },
        { label: "Often", score: 5 },
      ],
    },
    {
      category: "Emotional Well-being",
      question: "How would you describe your sleep quality?",
      points: 5,
      answers: [
        { label: "Good, I sleep well most nights", score: 1 },
        { label: "Okay, but sometimes I struggle", score: 3 },
        { label: "Poor, I rarely get enough rest", score: 5 },
      ],
    },
    {
      category: "Social Connection",
      question: "How connected do you feel with your friends and family?",
      points: 5,
      answers: [
        { label: "Very connected", score: 1 },
        { label: "Somewhat connected", score: 3 },
        { label: "Not connected at all", score: 5 },
      ],
    },
    {
      category: "Coping Mechanisms",
      question: "How do you usually cope with stress?",
      points: 5,
      answers: [
        { label: "Exercise or meditation", score: 1 },
        { label: "Watching TV or social media", score: 3 },
        { label: "Avoiding problems or substance use", score: 5 },
      ],
    },
    {
      category: "Self-esteem",
      question: "How often do you feel confident in yourself?",
      points: 5,
      answers: [
        { label: "Most of the time", score: 1 },
        { label: "Sometimes", score: 3 },
        { label: "Rarely or never", score: 5 },
      ],
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate();

  const handleAnswerClick = () => {
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
      <div className="absolute h-[70%]  left-1/2 transform -translate-x-1/2 w-[80%] md:w-[60%] lg:w-[40%] text-center px-4 py-10 bg-opacity-50 z-10 ">
        <div className="h-full rounded-3xl flex justify-center items-center bg-gradient-to-br from-[#88C090] to-[#6FA982] p-4">
          <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full h-full text-center border border-green-300">
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              {questions[currentQuestionIndex].question}
            </h2>
            <div className="flex flex-col space-y-4">
              {questions[currentQuestionIndex].answers.map((answer) => (
                <button
                  key={answer.label}
                  className="p-3 bg-[#88C090] hover:bg-[#6FA982] text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                  onClick={() => handleAnswerClick(answer.correct)}
                >
                  {answer.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
