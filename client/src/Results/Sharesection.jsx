import { useState, useEffect } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Smartphone,
} from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-center mb-5 text-gray-800">
        Share Your Results
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {canShare ? (
          <button
            onClick={handleWebShare}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition w-full"
          >
            <Share2 size={18} /> Share via Web
          </button>
        ) : (
          <>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(fullMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition w-full"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com&quote=${encodeURIComponent(
                fullMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition w-full"
            >
              <Facebook size={18} /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                fullMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition w-full"
            >
              <Twitter size={18} /> X (Twitter)
            </a>
            <a
              href={`sms:?&body=${encodeURIComponent(fullMessage)}`}
              className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition w-full"
            >
              <Smartphone size={18} /> SMS
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareSection;
