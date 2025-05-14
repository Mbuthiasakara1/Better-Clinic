/* eslint-disable no-unused-vars */

import { useState, useEffect, useMemo } from "react";
import { Copy, X, Share2, Download, Clipboard } from "lucide-react";

// Custom TikTok icon with brand colors
const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <g>
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 015.9 10.6v2.34A4.28 4.28 0 018 12.8v-1.7a1.92 1.92 0 00-.2 4 2 2 0 003.7-1c0-.16 0-.33-.02-.5v-7.3A4.27 4.27 0 0016.6 5.8z" fill="#FF004F"/>
      <path d="M17 4v4.2a4.27 4.27 0 01-3.8 1.2v7.3l.02.5A1.82 1.82 0 0119 18a2 2 0 01-3.7-1c0-.16 0-.33.02-.5v-2.3A4.28 4.28 0 0113 14.1v-2.33a4.278 4.278 0 0110.7-4.77S23.49 7.5 23 7a4.27 4.27 0 01-6-3z" fill="#00F2EA"/>
    </g>
  </svg>
);

// Custom WhatsApp icon with brand color
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path 
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" 
      fill="#25D366"
    />
  </svg>
);

// Custom Instagram icon with gradient
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <defs>
      <radialGradient id="instagramGradient" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <path
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      fill="url(#instagramGradient)"
    />
  </svg>
);

// Custom SMS icon with blue color
const SmsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path 
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" 
      fill="#0078FF" 
    />
    <path 
      d="M7 10h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" 
      fill="white" 
    />
  </svg>
);

// Improved screenshot generator for Instagram/TikTok sharing
const generateShareImage = (message, resultType, score) => {
  // Create a canvas to generate our sharable image
  const canvas = document.createElement("canvas");
  canvas.width = 1080; // Instagram post dimensions
  canvas.height = 1080;
  
  const ctx = canvas.getContext("2d");
  
  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#f8fafc");
  gradient.addColorStop(1, "#f1f5f9");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw accent color strip at top
  let accentColor;
  switch(resultType) {
    case "normal": accentColor = "#4ade80"; break;
    case "mild": accentColor = "#fbbf24"; break;
    case "moderate": accentColor = "#fb923c"; break;
    case "severe": accentColor = "#f87171"; break;
    default: accentColor = "#60a5fa";
  }
  
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, canvas.width, 12);
  
  // Draw subtle pattern
  ctx.fillStyle = "#ffffff20";
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 150 + 50;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  // Draw header with logo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 60, canvas.width, 120);
  ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;
  
  // Draw logo placeholder
  ctx.beginPath();
  ctx.arc(120, 120, 40, 0, 2 * Math.PI);
  ctx.fillStyle = accentColor;
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // Draw title
  ctx.font = "bold 38px Arial, sans-serif";
  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "left";
  ctx.fillText("Mental Health Assessment", 180, 130);
  
  // Draw divider
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 220);
  ctx.lineTo(canvas.width - 80, 220);
  ctx.stroke();
  
  // Draw circular score with shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(canvas.width/2, 380, 160, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // Progress ring
  const scorePercent = Math.min(100, Math.max(0, score)) / 100;
  const ringWidth = 20;
  
  // Background ring
  ctx.beginPath();
  ctx.arc(canvas.width/2, 380, 130, 0, 2 * Math.PI);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = ringWidth;
  ctx.stroke();
  
  // Progress ring
  ctx.beginPath();
  ctx.arc(canvas.width/2, 380, 130, -0.5 * Math.PI, (2 * scorePercent - 0.5) * Math.PI);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = ringWidth;
  ctx.stroke();
  
  // Score text
  ctx.font = "bold 100px Arial, sans-serif";
  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "center";
  ctx.fillText(`${Math.round(score)}%`, canvas.width/2, 410);
  
  // Result type label
  ctx.font = "600 32px Arial, sans-serif";
  ctx.fillStyle = accentColor;
  ctx.textAlign = "center";
  ctx.fillText(resultType.charAt(0).toUpperCase() + resultType.slice(1), canvas.width/2, 480);
  
  // Message wrap
  ctx.font = "400 28px Arial, sans-serif";
  ctx.fillStyle = "#475569";
  ctx.textAlign = "center";
  
  // Wrap text for message with improved styling
  const wrapText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineCount = 0;
    
    for(let i = 0; i < words.length; i++) {
      testLine += words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y + (lineCount * lineHeight));
        line = words[i] + ' ';
        testLine = words[i] + ' ';
        lineCount++;
      } else {
        line = testLine;
      }
    }
    
    ctx.fillText(line, x, y + (lineCount * lineHeight));
    return lineCount;
  };
  
  // Limit message length and wrap it
  let shortMessage = message;
  if (message.length > 180) {
    shortMessage = message.substring(0, 177) + "...";
  }
  
  const messageLines = wrapText(shortMessage, canvas.width/2, 580, 800, 40);
  
  // Draw design elements
  for (let i = 0; i < 5; i++) {
    const size = 12;
    const x = 80 + (i * 30);
    const y = 880;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = i % 2 === 0 ? accentColor : "#cbd5e1";
    ctx.fill();
  }
  
  // Draw app name/URL
  ctx.font = "600 32px Arial, sans-serif";
  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "center";
  ctx.fillText("MindfulCheck", canvas.width/2, 880);
  
  // Footer
  ctx.font = "400 20px Arial, sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "center";
  ctx.fillText("Professional guidance recommended • Not a diagnostic tool", canvas.width/2, 920);
  
  // Add QR code placeholder for website
  // ctx.fillStyle = "#f8fafc";
  // ctx.fillRect(canvas.width - 180, canvas.height - 180, 130, 130);
  // ctx.strokeStyle = "#e2e8f0";
  // ctx.lineWidth = 2;
  // ctx.strokeRect(canvas.width - 180, canvas.height - 180, 130, 130);
  
  // ctx.font = "400 16px Arial, sans-serif";
  // ctx.fillStyle = "#64748b";
  // ctx.textAlign = "center";
  // ctx.fillText("Scan for website", canvas.width - 115, canvas.height - 40);
  
  return canvas.toDataURL("image/png");
};

const ShareButtons = ({ results = {} }) => {
  const [canWebShare, setCanWebShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("instagram"); // or "tiktok"

  const fullMessage = useMemo(() => {
    const severity = (results.severity || "").trim().toLowerCase();
    const category = (results.category || "Mental Health").trim();
    const categorySuffix = category.toLowerCase() === "mental health"
      ? ""
      : ` in ${category.toLowerCase()}`;

    const desc = {
      normal: `I recently completed a mental health screening highlighting the importance of self-awareness and well-being. My results suggest a positive mental health approach${categorySuffix}.`,
      mild: `Mental health is a journey, and I'm taking steps to understand and support my well-being. I've learned valuable insights about self-care${categorySuffix}.`,
      moderate: `Taking care of mental health is a strength, not a weakness. I'm being proactive about understanding my emotional well-being${categorySuffix}.`,
      severe: `Mental health matters. I'm breaking the silence and encouraging open conversations about emotional well-being and support${categorySuffix}.`,
    }[severity] || "Mental health awareness is important. I've taken a step towards understanding my emotional well-being.";

    return `${desc}

Take the assessment: ${window.location.origin}

This is a screening tool to support your mental health journey. Professional guidance is always recommended.`;
  }, [results]);

  useEffect(() => {
    setCanWebShare(!!navigator.share);
    
    // Generate share image when results change
    if (results.severity && results.score !== undefined) {
      const imageUrl = generateShareImage(
        fullMessage.split('\n')[0], // Just use the first paragraph
        results.severity,
        results.score
      );
      setShareImageUrl(imageUrl);
    }
  }, [results, fullMessage]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${fullMessage}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWebShare = () => {
    navigator
      .share({ title: "My Mental Health Results", text: fullMessage, url: window.location.origin })
      .catch(console.error);
  };

  const handleImageDownload = () => {
    if (!shareImageUrl) return;
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = shareImageUrl;
    a.download = `mental-health-results-${results.severity || 'assessment'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyImage = async () => {
    if (!shareImageUrl || !navigator.clipboard?.write) {
      alert("Your browser doesn't support copying images to clipboard");
      return;
    }
    
    try {
      // Convert base64 to blob
      const res = await fetch(shareImageUrl);
      const blob = await res.blob();
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      alert("Image copied to clipboard! You can now paste it directly.");
    } catch (err) {
      console.error("Failed to copy image:", err);
      alert("Couldn't copy image to clipboard. Please try downloading instead.");
    }
  };

  const encoded = encodeURIComponent(fullMessage);
  const url = encodeURIComponent(window.location.origin);

  return (
   
    <div className="w-full max-w-3xl ">
      <h3 className="text-lg font-semibold text-center mb-1 text-gray-700">Share Your Results</h3>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm transition text-sm font-medium w-full"
          >
            <Copy className="w-5 h-5" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
    
          {/* SMS */}
          <a
            href={`sms:?&body=${encoded}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition text-sm font-medium w-full"
          >
            <SmsIcon />
            <span>SMS</span>
          </a>
    
          {/* X (Twitter) */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-900 shadow-sm transition text-sm font-medium w-full"
          >
            <X className="w-5 h-5" />
            <span></span>
          </a>
    
          {/* TikTok - Now opens modal */}
          <button
            onClick={() => {
              setActiveTab("tiktok");
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-900 shadow-sm transition text-sm font-medium w-full"
          >
            <TikTokIcon />
            <span>TikTok</span>
          </button>
    
          {/* Instagram - Now opens modal */}
          <button
            onClick={() => {
              setActiveTab("instagram");
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-sm transition text-sm font-medium w-full"
          >
            <InstagramIcon />
            <span>Instagram</span>
          </button>
    
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 shadow-sm transition text-sm font-medium w-full"
          >
            <WhatsAppIcon />
            <span>WhatsApp</span>
          </a>
    
          {/* Device Share (Web Share API) */}
          {canWebShare && (
            <button
              onClick={handleWebShare}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition text-sm font-medium w-full md:col-span-3"
            >
              <Share2 className="w-5 h-5" />
              <span>Share to Device</span>
            </button>
          )}
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-6">
          Sharing your experience helps break stigma around mental health
        </p>
      </div>

      {/* Improved Modal for Instagram/TikTok sharing */}
      {showModal && (
         
        <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center justify-center mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${activeTab === "instagram" ? "bg-gradient-to-tr from-pink-500 to-purple-500" : "bg-black"}`}>
                {activeTab === "instagram" ? <InstagramIcon /> : <TikTokIcon />}
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Share to {activeTab === "instagram" ? "Instagram" : "TikTok"}
              </h3>
            </div>
            
            <div className="flex mb-6">
              <button 
                onClick={() => setActiveTab("instagram")}
                className={`flex-1 py-2 text-center ${activeTab === "instagram" ? "border-b-2 border-pink-500 text-pink-600 font-medium" : "text-gray-500"}`}
              >
                Instagram
              </button>
              <button 
                onClick={() => setActiveTab("tiktok")}
                className={`flex-1 py-2 text-center ${activeTab === "tiktok" ? "border-b-2 border-black text-black font-medium" : "text-gray-500"}`}
              >
                TikTok
              </button>
            </div>
            
            <div className="mb-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              {activeTab === "instagram" ? (
                <div className="text-gray-700 text-sm">
                  <p className="font-medium text-blue-800 mb-2">Share to your Instagram</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-900">
                    <li>Download your personalized graphic below</li>
                    <li>Open Instagram and create a new post</li>
                    <li>Select the image from your gallery</li>
                    <li>Add your personal caption to connect with your audience</li>
                  </ol>
                </div>
              ) : (
                <div className="text-gray-700 text-sm">
                  <p className="font-medium text-blue-800 mb-2">Create engaging TikTok content</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-900">
                    <li>Save your personalized graphic below</li>
                    <li>Use it as your video background in TikTok</li>
                    <li>Share your mental health journey with your voice</li>
                    <li>Add relevant hashtags to reach others with similar experiences</li>
                  </ol>
                </div>
              )}
            </div>
            
            {/* Share image preview */}
            {shareImageUrl && (
              <div className="flex flex-col items-center">
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 max-w-full shadow-md">
                  <img 
                    src={shareImageUrl} 
                    alt="Shareable result" 
                    className="max-w-full h-auto"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row w-full space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleImageDownload}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition w-full"
                  >
                    <Download className="w-5 h-5" />
                    <span>Save Image</span>
                  </button>
                  
                  <button
                    onClick={handleCopyImage}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition w-full"
                  >
                    <Clipboard className="w-5 h-5" />
                    <span>Copy to Clipboard</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
       
      )}
    </div>
    
  );
};

export default ShareButtons;

