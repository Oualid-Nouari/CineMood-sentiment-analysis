'use client'

import React from 'react'

interface ProjectInfoModalProps {
  isOpen: boolean
  onClose: () => void
}


const IconRocket = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 10.5L2 14l5 2 3.5-3.5L14 18l5-5-3.5-3.5L18 7l-5 3zM9 9l-1.5-1.5L6 6l3-3 1.5 1.5L9 9zm8 8l-1.5-1.5L15 15l3-3 1.5 1.5L18 18zM12 2a10 10 0 100 20 10 10 0 000-20z"/>
    <path d="M22 12h-4"/>
    <path d="M6 12H2"/>
    <path d="M12 6V2"/>
    <path d="M12 22v-4"/>
  </svg>
);


const IconBrain = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a9.5 9.5 0 007.5-16C19.5 2.5 16 2.5 14.5 6A9.5 9.5 0 004.5 6C3 2.5-.5 2.5-.5 6A9.5 9.5 0 007 17.5"/>
    <path d="M12 22V18M12 18C10.3431 18 9 16.6569 9 15V12H15V15C15 16.6569 13.6569 18 12 18Z"/>
    <path d="M12 12H9.5C8.11929 12 7 10.8807 7 9.5V8M12 12H14.5C15.8807 12 17 10.8807 17 9.5V8"/>
    <path d="M7 8C7 6.89543 7.89543 6 9 6H10M17 8C17 6.89543 16.1046 6 15 6H14"/>
    <path d="M10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6"/>
  </svg>
);

const IconCode = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
    <line x1="12" y1="4" x2="10" y2="20"></line>
  </svg>
);


export default function ProjectInfoModal({ isOpen, onClose }: ProjectInfoModalProps) {
  if (!isOpen) return null;

  const sections = [
    {
      title: "Our Mission: Decoding Emotions",
      icon: <IconRocket className="w-7 h-7 text-sky-400" />,
      content: "Welcome to our Sentiment Analyzer! This app is a demonstration of how Artificial Intelligence can understand the emotional tone behind text. We're focusing on movie reviews to show this cool tech in action.",
      bgColor: "bg-sky-600/[0.15]",
    },
    {
      title: "How the Magic Happens",
      icon: <IconBrain className="w-7 h-7 text-purple-400" />,
      content: "When you submit a review:",
      list: [
        "Your text is cleaned up – removing things like HTML and preparing it for the AI.",
        "It's then processed using Natural Language Processing (NLP) techniques, including identifying special markers for negation (like 'not good') or emphasis.",
        "Word embeddings (GloVe) convert your words into a numerical format the AI understands.",
        "Finally, a trained Machine Learning model (Support Vector Machine - SVM) predicts the sentiment: Positive, Negative, or Neutral.",
        "The 'Confidence Score' indicates how sure the AI is. A score below 0.4 for Positive/Negative often suggests a more Neutral or mixed review in our setup.",
      ],
      bgColor: "bg-purple-600/[0.15]",
    },
    {
      title: "Tech Under the Hood",
      icon: <IconCode className="w-7 h-7 text-emerald-400" />,
      content: "This project is built with a blend of modern technologies:",
      list: [
        "Frontend: Next.js (React framework) with TypeScript & Tailwind CSS for a sleek, responsive experience.",
        "Backend API: Python with Flask, serving our powerful sentiment analysis model.",
        "AI & NLP: NLTK for text processing, Gensim for GloVe word embeddings, and Scikit-learn for the SVM classification model. The model was trained on the IMDB Dataset of movie reviews.",
      ],
      bgColor: "bg-emerald-600/[0.15]",
    }
  ];

  return (
    <div className="fixed z-50 inset-0 w-full h-full flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>

      <div 
        className="relative z-10 bg-slate-800/[0.8] backdrop-blur-xl rounded-xl w-full sm:w-[90vw] md:w-[70vw] max-w-[700px] text-white shadow-2xl border border-white/20 transform transition-all duration-300 ease-out scale-95 group-hover:scale-100 animate-fadeIn overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        `}</style>
        
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 sticky top-0 bg-slate-800/[0.8] backdrop-blur-xl z-20">
          <h2 className="text-xl md:text-2xl font-semibold text-sky-300">
            About CineMood
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-3xl font-light transition-colors"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
          {sections.map((section, index) => (
            <div key={index} className={`p-4 rounded-lg border border-white/10 shadow-md ${section.bgColor}`}>
              <div className="flex items-center gap-3 mb-2">
                {section.icon}
                <h3 className="text-lg md:text-xl font-semibold text-white/90">{section.title}</h3>
              </div>
              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {section.content}
              </p>
              {section.list && (
                <ul className="list-disc list-inside mt-2 space-y-1 pl-2 text-sm md:text-base text-white/70 leading-relaxed">
                  {section.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          
          <div className="text-center mt-6 p-4 bg-black/20 rounded-lg">
            <p className="text-sm text-white/70">
              We hope you enjoy exploring how AI interprets emotions in text!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}