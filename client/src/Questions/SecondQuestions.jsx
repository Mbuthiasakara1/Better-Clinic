/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useStore from "../../Store";
import toast from "react-hot-toast";


function SecondQuestions({ handleResponse }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age_group: "",
    gender: "",
    relationship_status: "",
  });
  const [animating, setAnimating] = useState(false);
  const { Session, setSession, user, setUser } = useStore();
  const navigate = useNavigate();
 

  const questions = [
    {
      key: "age_group",
      text: "How old are you?",
      options: ["<12", "12-17", "17-30", "30-55", ">55", "prefer not to say"],
      renderOptions: null,
    },
    {
      key: "gender",
      text: "What's your gender?",
      options: ["Male", "Female", "Other", "Prefer not to say"],
      renderOptions: renderGenderOptions,
    },
    {
      key: "relationship_status",
      text: "What is your relationship status?",
      options: [
        "Single",
        "In a Relationship",
        "Married",
        "Divorced",
        "Widowed",
      ],
      renderOptions: null,
    },
  ];

  function renderGenderOptions() {
    return (
      <div className="grid grid-cols-2 gap-3">
        <button
          className={`group relative overflow-hidden rounded-xl transition-all duration-500 shadow-xl ${
            formData.gender === "Male"
              ? "bg-gradient-to-br from-green-400 to-emerald-700 ring-2 ring-green-300 transform scale-105"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-400 hover:to-green-500"
          }`}
          onClick={() => handleOptionClick("Male")}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {formData.gender === "Male" && (
            <div className="absolute -top-8 -right-8 h-20 w-20 bg-white/30 rotate-12 transform"></div>
          )}
          <div className="p-3 flex flex-col items-center">
            <div className="bg-white/90 rounded-full p-2 mb-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <img
                src="/assets/silhoutted avatars/male.png"
                alt="Male"
                className="h-12 w-12"
              />
            </div>
            <span className="font-bold text-white drop-shadow-md">Male</span>
          </div>
          {formData.gender === "Male" && (
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
              <svg
                className="w-3 h-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
        </button>

        <button
          className={`group relative overflow-hidden rounded-xl transition-all duration-500 shadow-xl ${
            formData.gender === "Female"
              ? "bg-gradient-to-br from-green-400 to-emerald-700 ring-2 ring-green-300 transform scale-105"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-400 hover:to-green-500"
          }`}
          onClick={() => handleOptionClick("Female")}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {formData.gender === "Female" && (
            <div className="absolute -top-8 -right-8 h-20 w-20 bg-white/30 rotate-12 transform"></div>
          )}
          <div className="p-3 flex flex-col items-center">
            <div className="bg-white/90 rounded-full p-2 mb-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <img
                src="/assets/silhoutted avatars/female.png"
                alt="Female"
                className="h-12 w-12"
              />
            </div>
            <span className="font-bold text-white drop-shadow-md">Female</span>
          </div>
          {formData.gender === "Female" && (
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
              <svg
                className="w-3 h-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
        </button>

        <button
          className={`group relative overflow-hidden rounded-xl transition-all duration-500 shadow-xl ${
            formData.gender === "Other"
              ? "bg-gradient-to-br from-green-400 to-emerald-700 ring-2 ring-green-300 transform scale-105"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-400 hover:to-green-500"
          }`}
          onClick={() => handleOptionClick("Other")}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {formData.gender === "Other" && (
            <div className="absolute -top-8 -right-8 h-20 w-20 bg-white/30 rotate-12 transform"></div>
          )}
          <div className="p-3 flex flex-col items-center">
            <div className="bg-white/90 rounded-full p-2 mb-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <img
                src="/assets/silhoutted avatars/bald.png"
                alt="Other"
                className="h-12 w-12"
              />
            </div>
            <span className="font-bold text-white drop-shadow-md">Other</span>
          </div>
          {formData.gender === "Other" && (
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
              <svg
                className="w-3 h-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
        </button>

        <button
          className={`group relative overflow-hidden rounded-xl transition-all duration-500 shadow-xl ${
            formData.gender === "Prefer not to say"
              ? "bg-gradient-to-br from-green-400 to-emerald-700 ring-2 ring-green-300 transform scale-105"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-400 hover:to-green-500"
          }`}
          onClick={() => handleOptionClick("Prefer not to say")}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {formData.gender === "Prefer not to say" && (
            <div className="absolute -top-8 -right-8 h-20 w-20 bg-white/30 rotate-12 transform"></div>
          )}
          <div className="p-3 flex flex-col items-center">
            <div className="bg-white/90 rounded-full p-2 mb-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <img
                src="/assets/silhoutted avatars/48161398.jpg"
                alt="Prefer not to say"
                className="h-12 w-12"
              />
            </div>
            <span className="font-bold text-white drop-shadow-md text-xs">
              Prefer not to say
            </span>
          </div>
          {formData.gender === "Prefer not to say" && (
            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
              <svg
                className="w-3 h-3 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
        </button>
      </div>
    );
  }

  const handleOptionClick = (option) => {
    setFormData({ ...formData, [questions[step].key]: option });
  };

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setAnimating(false);
      }, 300);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setAnimating(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    try {
      const userResponse = await axios.post(
        "http://127.0.0.1:5000/api/user",
        formData,
        { withCredentials: true }
      );
      const userId = userResponse.data.user_id;
      setUser(userId);
      sessionStorage.setItem("user_id", userId)

      const sessionResponse = await axios.post(
        "http://127.0.0.1:5000/api/sessions",
        {
          user_id: userId,
          score: 0,
          paid: false,
          result_sent: false,
        }
      );
      const newSessionId = sessionResponse.data.id;
      setSession(newSessionId);
      sessionStorage.setItem("session_id", newSessionId);

      // Wait a moment before calling handleResponse to ensure state updates
      setTimeout(() => {
        handleResponse(newSessionId);
      }, 100);
    } catch (error) {
      toast.error("Error in session creation", error);
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-gradient-to-r from-green-400 to-teal-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-700 mb-6">
        {questions[step].text}
      </h2>

      <div
        className={`transition-all duration-300 ${
          animating
            ? "opacity-0 transform translate-x-8"
            : "opacity-100 transform translate-x-0"
        }`}
      >
        {questions[step].renderOptions ? (
          questions[step].renderOptions()
        ) : (
          <div className="flex flex-col space-y-3">
            {questions[step].options.map((option) => (
              <button
                key={option}
                className={`group relative overflow-hidden p-3 rounded-xl transition-all duration-300 ${
                  formData[questions[step].key] === option
                    ? "bg-gradient-to-r from-green-400 to-emerald-600 ring-2 ring-green-300 shadow-lg transform scale-105"
                    : "bg-gradient-to-r from-green-100 to-teal-100 hover:from-green-200 hover:to-teal-200 shadow-md"
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {formData[questions[step].key] === option && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                )}

                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center mr-3 w-6 h-6 rounded-full transition-all duration-300 ${
                      formData[questions[step].key] === option
                        ? "bg-white"
                        : "border-2 border-green-500"
                    }`}
                  >
                    {formData[questions[step].key] === option && (
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>

                  <span
                    className={`font-medium transition-all duration-300 ${
                      formData[questions[step].key] === option
                        ? "text-white"
                        : "text-green-800"
                    }`}
                  >
                    {option}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-teal-300 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 flex items-center ${
            step === 0
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400 shadow-md"
          }`}
          onClick={handleBack}
          disabled={step === 0}
        >
          {step > 0 && (
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
            formData[questions[step].key]
              ? "bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 shadow-lg"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!formData[questions[step].key]}
        >
          {step === questions.length - 1 ? "Submit" : "Next"}
          {formData[questions[step].key] && step < questions.length - 1 && (
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
   
    </>
  );
}

export default SecondQuestions;
