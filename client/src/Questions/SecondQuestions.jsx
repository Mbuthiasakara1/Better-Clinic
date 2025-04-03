/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useStore from "../../Store";

function SecondQuestions({ handleResponse }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age_group: "",
    gender: "",
    relationship_status: "",
  });
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { Session, setSession, user, setUser } = useStore();

  //  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const questions = [
    {
      key: "age_group",
      text: "What is your age?",
      options: ["0-20", "20-40", "40-60", "60+"],
    },
    {
      key: "gender",
      text: "What is your gender?",
      options: ["Male", "Female", "Other"],
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
    },
  ];

  const handleOptionClick = (option) => {
    setFormData({ ...formData, [questions[step].key]: option });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create user
      const userResponse = await axios.post(
        "http://127.0.0.1:5000/api/user",
        formData,
        { withCredentials: true }
      );
      const userId = userResponse.data.user_id;
      setUser(userId);

      // Create session
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

      setTimeout(() => {
        handleResponse(newSessionId);
      }, 100);
    } catch (error) {
      console.error("Error in user/session creation:", error);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-green-800 mb-6">
        {questions[step].text}
      </h2>

      <div className="flex flex-col space-y-3">
        {questions[step].options.map((option) => (
          <button
            key={option}
            className={`p-3 rounded-xl transition-all duration-300 shadow-md font-semibold text-white ${
              formData[questions[step].key] === option
                ? "bg-[#1b3323]"
                : "bg-[#88C090] hover:bg-[#6FA982]"
            }`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          className={`p-3 rounded-xl bg-gray-400 text-white shadow-md ${
            step === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-500"
          }`}
          onClick={handleBack}
          disabled={step === 0}
        >
          Back
        </button>

        <button
          className={`p-3 rounded-xl text-white shadow-md ${
            formData[questions[step].key]
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!formData[questions[step].key]}
        >
          {step === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </>
  );
}

export default SecondQuestions;
