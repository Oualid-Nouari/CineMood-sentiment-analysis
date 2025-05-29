'use client'

import React, { useMemo } from 'react'

// --- Data Interface (ensure this matches what Welcome.tsx passes) ---
interface SentimentApiResult {
  sentiment: string; // "Positive", "Negative", "Neutral", or "Error"
  confidence?: number; // 0 to 1 (overall confidence in P/N classification)
  probabilities?: {
    negative: number; // 0 to 1
    positive: number; // 0 to 1
  };
  error_message?: string;
}

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: SentimentApiResult
}

// --- SVG Icon Components (defined inline for simplicity) ---

const IconPositive = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconNegative = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 16C8 16 9.5 14 12 14C14.5 14 16 16 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconNeutral = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconError = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Main Modal Component ---
export default function ResultModal({ isOpen, onClose, result }: ResultModalProps) {
    
  const displayConfig = useMemo(() => {
    if (!result) {
        return {
            title: "Analyzing...",
            IconComponent: IconNeutral, // Or a dedicated loading spinner SVG
            iconColor: "text-gray-400",
            mainText: "Please wait while we analyze the sentiment.",
            gradientFrom: "from-gray-700",
            gradientTo: "to-gray-800",
            details: null
        };
    }

    let iconColor = "text-gray-400";
    let IconComponent: React.FC<{ className?: string }> = IconNeutral;
    let mainText = "";
    let friendlyExplanation = "";
    let gradientFrom = "from-gray-700";
    let gradientTo = "to-gray-800";

    if (result.sentiment === 'Error') {
      IconComponent = IconError;
      iconColor = "text-yellow-400"; // Error color
      mainText = "Analysis Error!";
      friendlyExplanation = result.error_message || "Something went wrong. Please try again.";
      gradientFrom = "from-red-500/[0.3]";
      gradientTo = "to-orange-500/[0.3]";
    } else {
        switch (result.sentiment) {
        case 'Positive':
            IconComponent = IconPositive;
            iconColor = "text-green-400";
            mainText = "Sounds Positive!";
            friendlyExplanation = "Our AI senses a happy and favorable tone in this review. Good vibes!";
            gradientFrom = "from-green-500/[0.3]";
            gradientTo = "to-emerald-500/[0.3]";
            break;
        case 'Negative':
            IconComponent = IconNegative;
            iconColor = "text-red-400";
            mainText = "Leaning Negative.";
            friendlyExplanation = "It seems this review has a critical or unhappy perspective. Not a fan, perhaps?";
            gradientFrom = "from-red-500/[0.3]";
            gradientTo = "to-rose-500/[0.3]";
            break;
        case 'Neutral':
        default:
            IconComponent = IconNeutral;
            iconColor = "text-blue-400";
            mainText = "Fairly Neutral.";
            friendlyExplanation = "The sentiment here appears to be balanced, mixed, or objective.";
            gradientFrom = "from-blue-500/[0.3]";
            gradientTo = "to-sky-500/[0.3]";
            break;
        }
    }

    // Confidence description
    let confidenceText = "The AI's confidence in this analysis is ";
    if (result.confidence !== undefined && result.sentiment !== 'Error') {
        if (result.confidence >= 0.8) confidenceText += "very high.";
        else if (result.confidence >= 0.6) confidenceText += "quite good.";
        else if (result.confidence >= 0.4) confidenceText += "moderate.";
        else confidenceText += "a bit low (might be very subtle or mixed).";
    } else if (result.sentiment !== 'Error') {
        confidenceText = "Confidence score is not available.";
    }


    return {
        title: result.sentiment === 'Error' ? "Oops!" : "Sentiment Snapshot",
        IconComponent,
        iconColor,
        mainText,
        friendlyExplanation,
        gradientFrom,
        gradientTo,
        confidenceScore: result.confidence,
        confidenceText: result.sentiment === 'Error' ? "" : confidenceText,
        probabilities: result.probabilities,
        isError: result.sentiment === 'Error'
    };
  }, [result])

  if (!isOpen) return null;

  const confidencePercentage = result?.confidence !== undefined ? Math.round(result.confidence * 100) : 0;
  const probPositivePercentage = result?.probabilities?.positive !== undefined ? Math.round(result.probabilities.positive * 100) : 0;
  const probNegativePercentage = result?.probabilities?.negative !== undefined ? Math.round(result.probabilities.negative * 100) : 0;


  return (
    <div className="fixed z-50 inset-0 w-full h-full flex items-center justify-center p-4 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className={`relative z-10 bg-gradient-to-br ${displayConfig.gradientFrom} ${displayConfig.gradientTo} rounded-xl p-6 md:p-8 w-full sm:w-[90vw] md:w-[70vw] max-w-[600px] text-white shadow-2xl border border-white/20 transform transition-all duration-300 ease-out scale-95 group-hover:scale-100 animate-fadeIn`}>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        `}</style>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-white/70 hover:text-white text-3xl font-light transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold opacity-90">{displayConfig.title}</h2>
        </div>

        {/* Main Sentiment Visual */}
        <div className="flex flex-col items-center mb-6">
          <div className={`${displayConfig.iconColor} mb-3`}>
            <displayConfig.IconComponent className="w-20 h-20 md:w-24 md:h-24" />
          </div>
          <p className={`text-xl md:text-2xl font-bold ${displayConfig.iconColor}`}>{displayConfig.mainText}</p>
          <p className="text-sm md:text-base text-white/80 mt-2 text-center max-w-md">{displayConfig.friendlyExplanation}</p>
        </div>

        {/* Details Section - Only show if not an error */}
        {!displayConfig.isError && (
          <div className="space-y-5 bg-black/20 p-4 rounded-lg border border-white/10">
            {/* Confidence Score */}
            {displayConfig.confidenceScore !== undefined && (
              <div>
                <h3 className="text-md font-semibold text-white/90 mb-1">AI Confidence Meter</h3>
                <div className="w-full bg-white/10 rounded-full h-6 overflow-hidden border border-white/20">
                  <div
                    className={`h-full rounded-full ${displayConfig.iconColor.replace('text-', 'bg-').replace('-400', '-500')} transition-all duration-500 ease-out flex items-center justify-center text-xs font-medium text-black/70`}
                    style={{ width: `${confidencePercentage}%` }}
                  >
                    {confidencePercentage}%
                  </div>
                </div>
                <p className="text-xs text-white/70 mt-1">{displayConfig.confidenceText}</p>
              </div>
            )}

            {/* Probabilities */}
            {displayConfig.probabilities && (
              <div>
                <h3 className="text-md font-semibold text-white/90 mb-2">Sentiment Leanings</h3>
                <div className="space-y-2">
                  {/* Positive Probability */}
                  <div>
                    <div className="flex justify-between text-xs text-white/80 mb-0.5">
                      <span>Likely Positive</span>
                      <span>{probPositivePercentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 border border-white/20">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: `${probPositivePercentage}%` }}></div>
                    </div>
                  </div>
                  {/* Negative Probability */}
                  <div>
                    <div className="flex justify-between text-xs text-white/80 mb-0.5">
                      <span>Likely Negative</span>
                      <span>{probNegativePercentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 border border-white/20">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: `${probNegativePercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Action Button (optional, if you want one inside the modal) */}
        {/* <button 
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition"
          >
            Got it!
        </button> */}
      </div>
    </div>
  )
}