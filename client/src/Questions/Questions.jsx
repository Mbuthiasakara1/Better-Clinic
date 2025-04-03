
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import SecondQuestions from "./SecondQuestions";
// import lottie from "lottie-web";
// import spinner from "../assets/spinner.json"

// function Questions() {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [showFinalStep, setShowFinalStep] = useState(false);
//   const [showSecondQuestions, setShowSecondQuestions] = useState(false);
//   const [responses, setResponses] = useState([]);
//   const [isSuccessful, setIsSuccessful] = useState(false);
//   const [isloading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     session_id: "",
//     question_id: "",
//     response_value: [],
//   });
  
//   const navigate = useNavigate();
//   const user_id = localStorage.getItem("user_id");
//   const container = useRef(null);

//   useEffect(() => {
//     const instance = lottie.loadAnimation({
//       container: container.current,
//       renderer: "svg",
//       loop: true,
//       autoplay: true,
//       animationData: spinner
//     });
//     return () => instance.destroy();
//   },[]);

//   // Fetch questions from API
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       setIsSuccessful(false);
//     }, 60000);
    
//     axios
//       .get("http://127.0.0.1:5000/api/questions")
//       .then((resp) => {
//         setQuestions(resp.data);
//         setIsSuccessful(true);
//         setIsLoading(false);
//         clearTimeout(timer);
//       })
//       .catch((error) => {
//         setIsSuccessful(false);
//         setIsLoading(true);
//         console.error("Error fetching questions:", error);
//       });
    
//     return () => clearTimeout(timer);
//   }, []);

//   // Reset selected option when moving to a new question
//   useEffect(() => {
//     setSelectedOption(null);
//   }, [currentQuestionIndex]);

//   const getButtonStyles = (index, isSelected) => {
//     const styles = [
//       { selected: "bg-blue-500 text-white", unselected: "border-blue-500 hover:bg-blue-500" },
//       { selected: "bg-yellow-500 text-white", unselected: "border-yellow-500 hover:bg-yellow-500" },
//       { selected: "bg-purple-500 text-white", unselected: "border-purple-500 hover:bg-purple-500" },
//       { selected: "bg-green-500 text-white", unselected: "border-green-500 hover:bg-green-500" },
//     ];
    
//     const style = styles[index % styles.length];
//     return isSelected ? style.selected : style.unselected;
//   };

//   const handleOptionClick = (index) => {
//     const selectedQuestion = questions[currentQuestionIndex];
    
//     setSelectedOption(index);
//     setFormData({
//       ...formData, 
//       session_id: user_id, 
//       question_id: selectedQuestion.id, 
//       response_value: selectedQuestion.options[index].text 
//     });

//     const updatedResponses = [...responses];
//     updatedResponses[currentQuestionIndex] = {
//       question_id: questions[currentQuestionIndex].id,
//       selected_option: questions[currentQuestionIndex].options[index].text,
//     };
    
//     setResponses(updatedResponses);
//   };
  
//   const handleNextQuestion = async () => {
//     if (currentQuestionIndex === questions.length - 1) {
//       setShowFinalStep(true);
//     } else {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//       setSelectedOption(null);
//     }
//   };

//   const handleMoveBack = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
//       setSelectedOption(null);
//     }
//   };

//   async function handleResponse() {
//     try {
//       await axios.post("http://127.0.0.1:5000/api/responses", {
//         session_id: user_id,
//         responses: responses,
//       });
//       console.log("Responses sent successfully:", responses);
//     } catch (error) {
//       console.error("Error submitting responses:", error);
//     }
//   }

//   return (
//     <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
//       <img
//         className="absolute w-full h-full object-cover opacity-100"
//         src="/assets/bg.jpeg"
//         alt="Background"
//       />

//       <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4">
//         <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-green-300 flex flex-col justify-center">
//           {showSecondQuestions ? (
//             <SecondQuestions handleResponse={handleResponse} />
//           ) : showFinalStep ? (
//             <>
//               <h2 className="text-2xl font-semibold text-green-800 mb-6">
//                 One more step to go!
//               </h2>
//               <p className="mb-4">
//                 You're almost there. Just a few more questions to complete your
//                 assessment.
//               </p>
//               <button
//                 className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
//                 onClick={() => setShowSecondQuestions(true)}
//               >
//                 Continue
//               </button>
//             </>
//           ) : questions.length > 0 ? (
//             <>
//               <h2 className="text-1xl font-semibold text-green-700">{`${currentQuestionIndex + 1} of ${questions.length}`}</h2>
//               <h2 className="text-2xl font-semibold text-green-900 mb-6">
//                 {questions[currentQuestionIndex].question_text}
//               </h2>
              
//               <div className="flex flex-col space-y-3">
//                 {questions[currentQuestionIndex]?.options?.map(
//                   (option, index) => (
//                     <button
//                       key={index}
//                       className={`p-3 rounded-xl transition-all duration-300 shadow-md font-semibold text-black border-2 ${
//                         selectedOption === index 
//                           ? getButtonStyles(index, true) 
//                           : `${getButtonStyles(index, false)} text-gray-800 hover:text-white`
//                       }`}
//                       onClick={() => handleOptionClick(index)}
//                     >
//                       {option.text}
//                     </button>
//                   )
//                 )}
//                 <div className="flex justify-between mt-2 w-full max-w-xs mx-auto overflow-hidden">
//                   <button
//                     className="w-20 h-10 bg-[#6e7970] hover:bg-[#bec7c1] text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
//                     onClick={handleMoveBack}
//                     disabled={currentQuestionIndex === 0}
//                   >
//                     Back
//                   </button>
//                   <button
//                     className={`w-20 h-10 text-white font-semibold rounded-xl transition-all duration-300 shadow-md ${
//                       selectedOption !== null
//                         ? "bg-[#00853E] hover:bg-[#1b3323]"
//                         : "bg-gray-400 cursor-not-allowed"
//                     }`}
//                     onClick={handleNextQuestion}
//                     disabled={selectedOption === null}
//                   >
//                     {currentQuestionIndex === questions.length - 1
//                       ? "Finish"
//                       : "Next"}
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : isloading ? (
//             <div className="container" ref={container}>
//             </div>
//           ) : questions.length === 0 ? (
//             <div className="text-red-500">
//               No questions available. Please try again later.
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Questions;



import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SecondQuestions from "./SecondQuestions";
import lottie from "lottie-web";
import spinner from "../assets/spinner.json";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFinalStep, setShowFinalStep] = useState(false);
  const [showSecondQuestions, setShowSecondQuestions] = useState(false);
  const [responses, setResponses] = useState([]);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    session_id: "",
    question_id: "",
    response_value: [],
  });

  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const container = useRef(null);

  // Lottie animation setup
  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: spinner,
    });
    return () => instance.destroy();
  }, []);

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
      { selected: "bg-blue-500 text-white", unselected: "border-blue-500 hover:bg-blue-500" },
      { selected: "bg-yellow-500 text-white", unselected: "border-yellow-500 hover:bg-yellow-500" },
      { selected: "bg-purple-500 text-white", unselected: "border-purple-500 hover:bg-purple-500" },
      { selected: "bg-green-500 text-white", unselected: "border-green-500 hover:bg-green-500" },
    ];

    const style = styles[index % styles.length];
    return isSelected ? style.selected : style.unselected;
  };

  const handleOptionClick = (index) => {
    const selectedQuestion = questions[currentQuestionIndex];

    setSelectedOption(index);
    setFormData({
      ...formData,
      session_id: user_id,
      question_id: selectedQuestion.id,
      response_value: selectedQuestion.options[index].text,
    });

    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = {
      question_id: questions[currentQuestionIndex].id,
      selected_option: questions[currentQuestionIndex].options[index].text,
    };

    setResponses(updatedResponses);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      setShowFinalStep(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    }
  };

  const handleMoveBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedOption(null);
    }
  };

  async function handleResponse() {
    try {
      await axios.post("http://127.0.0.1:5000/api/responses", {
        session_id: user_id,
        responses: responses,
      });
      console.log("Responses sent successfully:", responses);
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />

      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4">
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-green-300 flex flex-col justify-center">
          {showSecondQuestions ? (
            <SecondQuestions handleResponse={handleResponse} />
          ) : showFinalStep ? (
            <>
              <h2 className="text-2xl font-semibold text-green-800 mb-6">
                One more step to go!
              </h2>
              <p className="mb-4">
                You're almost there. Just a few more questions to complete your
                assessment.
              </p>
              <button
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                onClick={() => setShowSecondQuestions(true)}
              >
                Continue
              </button>
            </>
          ) : isloading ? (
            <div className="container w-24 h-24 flex justify-center items-center" ref={container}></div>
          ) : !isSuccessful ? (
            <div className="flex flex-col items-center justify-center">
              <div className="container" ref={container}></div>
            </div>
          ) : questions.length > 0 ? (
            <>
              <h2 className="text-1xl font-semibold text-green-700">{`${currentQuestionIndex + 1} of ${questions.length}`}</h2>
              <h2 className="text-2xl font-semibold text-green-900 mb-6">
                {questions[currentQuestionIndex].question_text}
              </h2>

              <div className="flex flex-col space-y-3">
                {questions[currentQuestionIndex]?.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-md font-semibold text-black border-2 ${
                      selectedOption === index
                        ? getButtonStyles(index, true)
                        : `${getButtonStyles(index, false)} text-gray-800 hover:text-white`
                    }`}
                    onClick={() => handleOptionClick(index)}
                  >
                    {option.text}
                  </button>
                ))}
                <div className="flex justify-between mt-2 w-full max-w-xs mx-auto overflow-hidden">
                  <button
                    className="w-20 h-10 bg-[#6e7970] hover:bg-[#bec7c1] text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                    onClick={handleMoveBack}
                    disabled={currentQuestionIndex === 0}
                  >
                    Back
                  </button>
                  <button
                    className={`w-20 h-10 text-white font-semibold rounded-xl transition-all duration-300 shadow-md ${
                      selectedOption !== null ? "bg-[#00853E] hover:bg-[#1b3323]" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleNextQuestion}
                    disabled={selectedOption === null}
                  >
                    {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
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
