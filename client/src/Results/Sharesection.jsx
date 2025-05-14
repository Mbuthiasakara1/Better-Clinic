import { useState, useEffect } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Smartphone,
} from "lucide-react";

function ShareButtons ({ results }){
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
   <>
     {canShare ? (
       <button
         onClick={handleWebShare}
         className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm"
       >
         <Share2 size={16} /> Share via Web
       </button>
     ) : (
       <>
         <a
           href={`https://wa.me/?text=${encodeURIComponent(fullMessage)}`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
         >
           <MessageCircle size={16} /> WhatsApp
         </a>
         <a
           href={`https://www.facebook.com/sharer/sharer.php?u=https://yourapp.com&quote=${encodeURIComponent(
             fullMessage
           )}`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
         >
           <Facebook size={16} /> Facebook
         </a>
         <a
           href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
             fullMessage
           )}`}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition text-sm"
         >
           <Twitter size={16} /> X (Twitter)
         </a>
         <a
           href={`sms:?&body=${encodeURIComponent(fullMessage)}`}
           className="flex items-center justify-center gap-2 bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition text-sm"
         >
           <Smartphone size={16} /> SMS
         </a>
       </>
     )}
   </>
 );

};

export default ShareButtons;
