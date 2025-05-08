/* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import axios from "axios";
// import ShareSection from "./Sharesection";
// import { useNavigate } from "react-router-dom";

// const Results = () => {
//   const [percentage, setPercentage] = useState(0);
//   const [showResults, setShowResults] = useState(false);
//   const [results, setResults] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const duration = 5000;
//     const intervalDuration = 50;
//     const steps = duration / intervalDuration;
//     const increment = 100 / steps;

//     const interval = setInterval(() => {
//       setPercentage((prev) => {
//         const next = prev + increment;
//         return next >= 100 ? 100 : next;
//       });
//     }, intervalDuration);

//     const timeout = setTimeout(() => {
//       setShowResults(true);
//       clearInterval(interval);
//     }, duration);

//     return () => {
//       clearTimeout(timeout);
//       clearInterval(interval);
//     };
//   }, []);

// useEffect(() => {
//   const session_id = sessionStorage.getItem("session_id");
//   if (session_id) {
//     axios
//       .get(`http://127.0.0.1:5000/api/${session_id}/session`, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => {
//         setResults(res.data.message);
//       })
//       .catch((err) => {
//         console.error("Error fetching results:", err);
//       });
//   }
// }, []);
// useEffect(() => {
//   window.history.pushState({ page: "results" }, "", "");
// }, []);

// useEffect(() => {
//   const handlePopState = async () => {
//     const session_id = sessionStorage.getItem("session_id");

//     if (session_id) {
//       try {
//         await axios.delete(`http://127.0.0.1:5000/api/${session_id}/session`);
//         sessionStorage.removeItem("session_id");
//       } catch (err) {
//         console.error("Failed to delete session:", err);
//       }
//     }

//     // Push state again to prevent further back navs
//     window.history.pushState({ page: "results" }, "", "");

//     // Navigate to home manually
//     navigate("/", { replace: true });
//   };

//   window.addEventListener("popstate", handlePopState);

//   return () => {
//     window.removeEventListener("popstate", handlePopState);
//   };
// }, [navigate]);

//   return (
//     <div className="relative w-screen h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
//       <img
//         className="absolute w-full h-full object-cover opacity-100"
//         src="/assets/bg.jpeg"
//         alt="Background"
//       />
//       <div className="absolute left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4 py-10 bg-opacity-50 z-10 h-full rounded-3xl flex justify-center items-center p-4"></div>
//       <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center border border-green-300 flex flex-col justify-center z-20">
//         {!showResults ? (
//           <>
//             <div className="w-40 h-40 mx-auto">
//               <CircularProgressbar
//                 value={percentage}
//                 text={`${percentage}%`}
//                 styles={buildStyles({
//                   textColor: "#4CAF50",
//                   pathColor: "#4CAF50",
//                   trailColor: "#d6d6d6",
//                 })}
//               />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-700">
//               Fetching your results...
//             </h2>
//           </>
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold text-green-600">Your Results</h2>
//             <p className="text-gray-600 mt-4">
//               {results ? results : "No result message available."}
//             </p>
//             <ShareSection results={results} />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Results;

import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RefreshCw, Share2, Heart, Brain } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Results = () => {
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [resultType, setResultType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Animate progress
    const duration = 3000;
    const intervalDuration = 30;
    const steps = duration / intervalDuration;
    const increment = 100 / steps;

    const interval = setInterval(() => {
      setPercentage((prev) => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, intervalDuration);

    const session_id = sessionStorage.getItem("session_id");

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (session_id) {
        axios
          .get(`http://127.0.0.1:5000/api/${session_id}/session`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            const data = res.data;
            setScore(data.score);
            setResultType(normalizeSeverity(data.severity));
            setMessage(data.message);
            setIsLoading(false);
          })
          .catch((err) => {
            toast.error("Error fetching results:", err);
            setError("Failed to fetch results. Please try again.");
            setIsLoading(false);
          });
      } else {
        setError("No session ID found. Please retake the test.");
        setIsLoading(false);
      }
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Map backend severity to UI result type
  const normalizeSeverity = (severity) => {
    if (!severity || typeof severity !== "string") return "unknown";
    switch (severity.toLowerCase()) {
      case "normal":
        return "normal";
      case "mild":
        return "mild";
      case "moderate":
        return "moderate";
      case "severe":
        return "severe";
      default:
        return "unknown";
    }
  };

  // Icons and style helpers
  const getResultIcon = () => {
    switch (resultType) {
      case "normal":
        return <Heart className="w-8 h-8 text-green-500" />;
      case "mild":
      case "moderate":
      case "severe":
        return <Brain className="w-8 h-8 text-red-500" />;
      default:
        return <Brain className="w-8 h-8 text-gray-500" />;
    }
  };

  const getScoreColor = () => {
    switch (resultType) {
      case "normal":
        return "text-green-600";
      case "mild":
        return "text-yellow-800";
      case "moderate":
        return "text-orange-600";
      case "severe":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getProgressColor = () => {
    switch (resultType) {
      case "normal":
        return "#4CAF50";
      case "mild":
        return "#ffb13b";
      case "moderate":
        return "#FF9800";
      case "severe":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getBadgeStyle = () => {
    switch (resultType) {
      case "normal":
        return "border-green-500 bg-green-100 text-green-700";
      case "mild":
        return "border-yellow-500 bg-yellow-100 text-yellow-700";
      case "moderate":
        return "border-orange-500 bg-orange-100 text-orange-700";
      case "severe":
        return "border-red-500 bg-red-100 text-red-700";
      default:
        return "border-gray-300 bg-gray-100 text-gray-700";
    }
  };

  const getMessageType = () => {
    switch (resultType) {
      case "normal":
        return "You're doing well!";
      case "mild":
        return "Mild symptoms detected";
      case "moderate":
        return "Moderate concern";
      case "severe":
        return "Severe symptoms detected";
      default:
        return "Unknown result";
    }
  };

  const getRecommendations = () => {
    switch (resultType) {
      case "normal":
        return [
          "Keep maintaining a healthy lifestyle.",
          "Continue engaging in activities you enjoy.",
          "Check in periodically with your mental well-being.",
        ];
      case "mild":
        return [
          "Practice mindfulness and relaxation techniques.",
          "Stay connected with friends or family.",
          "Monitor symptoms and consider a self-help plan.",
        ];
      case "moderate":
        return [
          "Talk to a mental health professional.",
          "Consider structured therapy or counseling.",
          "Build a daily routine that includes stress-relieving activities.",
        ];
      case "severe":
        return [
          "Seek professional help immediately.",
          "Reach out to a therapist or counselor.",
          "Avoid isolation and ensure a strong support system.",
        ];
      default:
        return ["No recommendations available."];
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      bgColor: "bg-gray-700",
      hoverColor: "hover:bg-gray-800",
    },
    {
      name: "Share on Twitter",
      bgColor: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
    },
    {
      name: "Share on Facebook",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      name: "Email Results",
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  ];

  // Prevent back navigation
  useEffect(() => {
    window.history.pushState({ page: "results" }, "", "");
  }, []);

  useEffect(() => {
    const handlePopState = async () => {
      const session_id = sessionStorage.getItem("session_id");

      if (session_id) {
        try {
          await axios.delete(`http://127.0.0.1:5000/api/${session_id}/session`);
          sessionStorage.removeItem("session_id");
        } catch (err) {
          console.error("Failed to delete session:", err);
        }
      }

      window.history.pushState({ page: "results" }, "", "");
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center px-4 md:px-10 lg:px-20 text-gray-900 dark:text-white overflow-hidden">
      <img
        className="absolute w-full h-full object-cover opacity-100"
        src="/assets/bg.jpeg"
        alt="Background"
      />

      {isLoading ? (
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border-2 border-green-300 flex flex-col justify-center z-20 animate-pulse">
          <div className="w-32 h-32 mx-auto">
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
              styles={buildStyles({
                textColor: "#4CAF50",
                pathColor: "#4CAF50",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            Analyzing your responses...
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Preparing your personalized results
          </p>
        </div>
      ) : error ? (
        <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border-2 border-red-300 flex flex-col justify-center z-20">
          <div className="text-red-500 mb-4">
            <RefreshCw className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition mx-auto flex items-center"
          >
            Try Again <RefreshCw className="ml-2 w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-3xl p-4 md:p-4 max-w-md md:max-w-lg w-full text-center border-2 border-green-300 flex flex-col justify-center z-20 transition-all duration-500 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-center space-x-2 mb-3">
            {getResultIcon()}
            <h2 className="text-xl font-bold text-green-600">Your Results</h2>
          </div>

          {/* Badge */}
          <div
            className={`${getScoreColor()} mx-auto px-3 py-1 rounded-full text-xs font-medium inline-block mb-3 border ${getBadgeStyle()}`}
          >
            {getMessageType()}
          </div>

          {/* Circular Progress */}
          <div className="w-24 h-24 mx-auto mb-3">
            <CircularProgressbar
              value={score}
              text={`${Math.round(score)}%`}
              styles={buildStyles({
                textColor: getProgressColor(),
                pathColor: getProgressColor(),
                trailColor: "#e5e7eb",
              })}
            />
          </div>

          {/* Main Message */}
          <div className="bg-gray-50 rounded-2xl p-4 shadow-inner mt-1 mb-4">
            <p className={`${getScoreColor()} text-base font-semibold mb-2`}>
              {message}
            </p>

            {/* Recommendations */}
            <div className="mt-3 text-left text-sm text-gray-600 bg-white p-3 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-1">Recommendations:</h3>
              <ul className="list-disc list-inside space-y-1">
                {getRecommendations().map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Retake button */}
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition mx-auto mb-4 flex items-center"
          >
            Take Test Again <RefreshCw className="ml-2 w-4 h-4" />
          </button>

          {/* Share Section */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Share2 className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Share your results
            </h3>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className={`${option.bgColor} ${option.hoverColor} text-white px-3 py-2 rounded-xl transition text-xs font-medium flex items-center justify-center`}
              >
                {option.name}
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <p className="text-gray-500 text-[10px] mt-4">
            This assessment is not a clinical diagnosis. Please consult a
            healthcare professional for proper medical advice.
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
