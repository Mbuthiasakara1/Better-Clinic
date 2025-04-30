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
