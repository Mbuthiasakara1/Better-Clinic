import { useState, useEffect } from "react";

const ShareSection = ({ results }) => {
  const [canShare, setCanShare] = useState(false);

  const fullMessage = `${results}\n\nTake yours: http://localhost:5173`;

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  const handleWebShare = () => {
    navigator
      .share({
        title: "Mental Health Assessment Result",
        text: fullMessage,
        url: "https://yourapp.com",
      })
      .then(() => console.log("Shared successfully"))
      .catch((err) => console.error("Share failed:", err));
  };

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      {canShare ? (
        <button
          onClick={handleWebShare}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Share Results
        </button>
      ) : (
        <>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(fullMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com&quote=${encodeURIComponent(
              fullMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Share on Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              fullMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Share on X
          </a>
          <a
            href={`sms:?&body=${encodeURIComponent(fullMessage)}`}
            className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Share via SMS
          </a>
        </>
      )}
    </div>
  );
};

export default ShareSection;
