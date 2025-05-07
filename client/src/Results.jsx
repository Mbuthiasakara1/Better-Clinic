import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import useStore from "../Store";

const Results = () => {
  const [percentage, setPercentage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { Session } = useStore();
  const [results, setResults] = useState("");

  useEffect(() => {
    const duration = 5000; 
    const intervalDuration = 50; 
    const steps = duration / intervalDuration; 
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setPercentage((prev) => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, intervalDuration);

    const timeout = setTimeout(() => {
      setShowResults(true);
      clearInterval(interval);
    }, duration);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/${Session}/session`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setResults(res.data.message);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
      });
  }, [Session]);
  return (
    <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />
      <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4"></div>
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-green-300 flex flex-col justify-center z-20">
        {!showResults ? (
          <>
            <div className="w-40 h-40 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textColor: "#4CAF50",
                  pathColor: "#4CAF50",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              Fetching your results...
            </h2>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green-600">Your Results</h2>
            <p className="text-gray-600 mt-4">
              {results ? results : "No result message available."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(results)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
              >
                Share on WhatsApp
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com&quote=${encodeURIComponent(
                  results
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Share on Facebook
              </a>

              {/* X (Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  results
                )}&url=http://localhost:5173`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Share on X
              </a>

              {/* SMS */}
              <a
                href={`sms:?&body=${encodeURIComponent(results)}`}
                className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Share via SMS
              </a>
              {/* <a
                href={`sms:?&body=${encodeURIComponent(results)}`}
                className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
              >
                Share via TikTok
              </a> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;




// import React, { useEffect, useState } from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { RefreshCw, Share2, Heart, Brain } from "lucide-react";

// const Results = () => {
//   const [percentage, setPercentage] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // User result data - now with dynamic calculation
//   const [score, setScore] = useState(0);
//   const [resultType, setResultType] = useState("");
//   const [message, setMessage] = useState("");
  
//   useEffect(() => {
//     // Loading animation
//     const duration = 3000;
//     const intervalDuration = 30;
//     const steps = duration / intervalDuration;
//     const increment = 100 / steps;

//     const interval = setInterval(() => {
//       setPercentage((prev) => {
//         const next = prev + increment;
//         return next >= 100 ? 100 : next;
//       });
//     }, intervalDuration);

//     // Simulate API response / calculate score from session storage
//     const timeout = setTimeout(() => {
//       clearInterval(interval);
//       setIsLoading(false);
      
//       // Get answers from session storage (or API in production)
//       calculateResult();
//     }, duration);

//     return () => {
//       clearTimeout(timeout);
//       clearInterval(interval);
//     };
//   }, []);

//   // Calculate the score and determine result type based on answers
//   const calculateResult = () => {
//     try {
//       // In production, you'd get this from your API or session storage
//       // For demo purposes, we'll simulate different scores
      
//       // Simulate getting answers from sessionStorage
//       // In real app: const answers = JSON.parse(sessionStorage.getItem('userAnswers'));
      
//       // DEMO MODE: Uncommment one of these lines to test different scenarios
//       // const simulatedScore = 15; // For "normal" - below 25%
//       // const simulatedScore = 27; // For "mild" - 25-50%
//       const simulatedScore = 35; // For "moderate" - 50-75%
//       // const simulatedScore = 48; // For "severe" - above 75%
      
//       // Get max possible score (based on questions data)
//       // In your app, this would be the total max possible score
//       const maxScore = 51; // 17 questions with max score of 3 each
      
//       // Calculate percentage
//       const calculatedScore = (simulatedScore / maxScore) * 100;
      
//       // Set the score 
//       setScore(calculatedScore);
      
//       // Determine result type based on percentage
//       let type;
//       if (calculatedScore < 25) {
//         type = "normal";
//       } else if (calculatedScore < 50) {
//         type = "mild";
//       } else if (calculatedScore < 75) {
//         type = "moderate";
//       } else {
//         type = "severe";
//       }
      
//       setResultType(type);
      
//       // Set appropriate message based on type
//       setMessage(`Your depression score is ${calculatedScore.toFixed(1)}%. You have ${type} depression symptoms.`);
      
//     } catch (err) {
//       console.error('Error calculating results:', err);
//       setError('Failed to calculate your results. Please try again.');
//     }
//   };

//   // Function to determine message color based on result type
//   const getScoreColor = () => {
//     switch (resultType) {
//       case "normal":
//         return "text-green-700";
//       case "mild":
//         return "text-green-600";
//       case "moderate":
//         return "text-yellow-600";
//       case "severe":
//         return "text-red-600";
//       default:
//         return "text-gray-700";
//     }
//   };

//   // Function to get message type based on result type
//   const getMessageType = () => {
//     switch (resultType) {
//       case "normal":
//         return "Healthy Mental State";
//       case "mild":
//         return "Mild Symptoms";
//       case "moderate":
//         return "Moderate Symptoms";
//       case "severe":
//         return "Severe Symptoms";
//       default:
//         return "Your Assessment";
//     }
//   };

//   // Function to get appropriate icon based on result type
//   const getResultIcon = () => {
//     switch (resultType) {
//       case "normal":
//         return <Heart className="w-12 h-12 text-green-700" />;
//       case "mild":
//         return <Heart className="w-12 h-12 text-green-500" />;
//       case "moderate":
//         return <Brain className="w-12 h-12 text-yellow-500" />;
//       case "severe":
//         return <Brain className="w-12 h-12 text-red-500" />;
//       default:
//         return <Brain className="w-12 h-12 text-blue-500" />;
//     }
//   };
  
//   // Function to get badge style based on result type
//   const getBadgeStyle = () => {
//     switch (resultType) {
//       case "normal":
//         return "border-green-200 bg-green-50";
//       case "mild":
//         return "border-green-200 bg-green-50";
//       case "moderate":
//         return "border-yellow-200 bg-yellow-50";
//       case "severe":
//         return "border-red-200 bg-red-50";
//       default:
//         return "border-blue-200 bg-blue-50";
//     }
//   };

//   // Function to get color for the progress circle
//   const getProgressColor = () => {
//     switch (resultType) {
//       case "normal":
//         return "#22c55e"; // green-500
//       case "mild":
//         return "#4ade80"; // green-400
//       case "moderate":
//         return "#eab308"; // yellow-500
//       case "severe":
//         return "#ef4444"; // red-500
//       default:
//         return "#3b82f6"; // blue-500
//     }
//   };

//   // Function to get recommendations based on result type
//   const getRecommendations = () => {
//     switch (resultType) {
//       case "normal":
//         return [
//           "Continue your healthy lifestyle habits",
//           "Maintain regular physical activity and social connections",
//           "Practice preventative mental wellness techniques",
//           "Consider taking periodic check-ins to monitor your mental health"
//         ];
//       case "mild":
//         return [
//           "Consider adding mindfulness practices to your daily routine",
//           "Ensure you're getting adequate sleep and exercise",
//           "Maintain healthy social connections",
//           "Monitor your symptoms and retake the assessment in 2-4 weeks"
//         ];
//       case "moderate":
//         return [
//           "Practice daily mindfulness meditation",
//           "Consider speaking with a mental health professional",
//           "Maintain regular physical activity",
//           "Ensure adequate sleep and nutrition"
//         ];
//       case "severe":
//         return [
//           "We strongly recommend consulting with a mental health professional",
//           "Consider joining a support group for additional emotional support",
//           "Establish a consistent daily routine including physical activity",
//           "Practice self-compassion and avoid isolation"
//         ];
//       default:
//         return [
//           "Practice daily mindfulness meditation",
//           "Consider speaking with a mental health professional",
//           "Maintain regular physical activity",
//           "Ensure adequate sleep and nutrition"
//         ];
//     }
//   };

//   // Share options
//   const shareOptions = [
//     { 
//       name: "WhatsApp", 
//       bgColor: "bg-green-500",
//       hoverColor: "hover:bg-green-600"
//     },
//     { 
//       name: "Facebook", 
//       bgColor: "bg-blue-600",
//       hoverColor: "hover:bg-blue-700"
//     },
//     { 
//       name: "X", 
//       bgColor: "bg-black",
//       hoverColor: "hover:bg-gray-800"
//     },
//     { 
//       name: "SMS", 
//       bgColor: "bg-gray-700",
//       hoverColor: "hover:bg-gray-800"
//     }
//   ];

//   return (
//     <div className="relative w-full h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
//       <img
//         className="absolute w-full h-full object-cover opacity-100"
//         src="/api/placeholder/800/600"
//         alt="Background"
//       />

//       {isLoading ? (
//         <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border-2 border-green-300 flex flex-col justify-center z-20 animate-pulse">
//           <div className="w-32 h-32 mx-auto">
//             <CircularProgressbar
//               value={percentage}
//               text={`${Math.round(percentage)}%`}
//               styles={buildStyles({
//                 textColor: "#4CAF50",
//                 pathColor: "#4CAF50",
//                 trailColor: "#d6d6d6",
//               })}
//             />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700 mt-4">
//             Analyzing your responses...
//           </h2>
//           <p className="text-gray-500 mt-2 text-sm">
//             Preparing your personalized results
//           </p>
//         </div>
//       ) : error ? (
//         <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border-2 border-red-300 flex flex-col justify-center z-20">
//           <div className="text-red-500 mb-4">
//             <RefreshCw className="w-16 h-16 mx-auto" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700">Error</h2>
//           <p className="text-gray-600 mt-2">{error}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition mx-auto flex items-center"
//           >
//             Try Again <RefreshCw className="ml-2 w-4 h-4" />
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md md:max-w-lg w-full text-center border-2 border-green-300 flex flex-col justify-center z-20 transition-all duration-500 ease-in-out">
//           {/* Header with icon and title */}
//           <div className="flex items-center justify-center space-x-3 mb-4">
//             {getResultIcon()}
//             <h2 className="text-2xl font-bold text-green-600">Your Results</h2>
//           </div>
          
//           {/* Result type badge */}
//           <div className={`${getScoreColor()} mx-auto px-4 py-1 rounded-full text-sm font-medium inline-block mb-4 border ${getBadgeStyle()}`}>
//             {getMessageType()}
//           </div>
          
//           {/* Progress circle for score visualization */}
//           <div className="w-32 h-32 mx-auto mb-4">
//             <CircularProgressbar
//               value={score}
//               text={`${Math.round(score)}%`}
//               styles={buildStyles({
//                 textColor: getProgressColor(),
//                 pathColor: getProgressColor(),
//                 trailColor: "#e5e7eb",
//               })}
//             />
//           </div>
          
//           {/* Main result information */}
//           <div className="bg-gray-50 rounded-2xl p-6 shadow-inner mt-2 mb-6">
//             <p className={`${getScoreColor()} text-lg font-semibold mb-2`}>
//               {message}
//             </p>
            
//             {/* Recommendations section */}
//             <div className="mt-4 text-left text-sm text-gray-600 bg-white p-4 rounded-xl">
//               <h3 className="font-bold text-gray-800 mb-2">Recommendations:</h3>
//               <ul className="list-disc list-inside space-y-1">
//                 {getRecommendations().map((recommendation, index) => (
//                   <li key={index}>{recommendation}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Take test button */}
//           <button
//             onClick={() => window.location.href = '/'}
//             className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition mx-auto mb-6 flex items-center"
//           >
//             Take Test Again <RefreshCw className="ml-2 w-4 h-4" />
//           </button>
          
//           {/* Share section header */}
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <Share2 className="w-5 h-5 text-gray-600" />
//             <h3 className="text-lg font-semibold text-gray-700">Share your results</h3>
//           </div>
          
//           {/* Share buttons grid */}
//           <div className="grid grid-cols-2 gap-3">
//             {shareOptions.map((option, index) => (
//               <button
//                 key={index}
//                 className={`${option.bgColor} ${option.hoverColor} text-white px-3 py-2 rounded-xl transition text-sm font-medium flex items-center justify-center`}
//               >
//                 {option.name}
//               </button>
//             ))}
//           </div>
          
//           {/* Footer note */}
//           <p className="text-gray-500 text-xs mt-6">
//             This assessment is not a clinical diagnosis. Please consult a healthcare professional for proper medical advice.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Results;