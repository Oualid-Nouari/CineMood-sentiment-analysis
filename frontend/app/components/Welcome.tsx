'use client'

import React, { useState, useEffect, useCallback } from 'react'
import moviesData from "../../public/movies.json"
import ResultModal from './ResultModal'

interface SentimentApiResult {
  sentiment: string;
  confidence?: number;
  probabilities?: {
    negative: number;
    positive: number;
  };
  error_message?: string;
}

export default function Welcome() {
  const [openResultModal, setOpenResultModal] = useState(false)
  const [randomMovie, setRandomMovie] = useState<{
    question: string
    poster: string
  } | null>(null)

  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiResult, setApiResult] = useState<SentimentApiResult | null>(null)

  const pickRandomMovie = useCallback(() => {
    if (moviesData && moviesData.length > 0) {
      const randomIndex = Math.floor(Math.random() * moviesData.length)
      setRandomMovie(moviesData[randomIndex])
    } else {
      console.error("Movies data is not loaded or empty.");
      setRandomMovie(null);
    }
  }, [])

  useEffect(() => {
    pickRandomMovie()
  }, [pickRandomMovie])

  const handleSubmit = async () => {
    if (comment.trim() === "") return;

    setIsLoading(true);
    setApiResult(null);

    try {
      const response = await fetch('http://localhost:5001/predict_sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review_text: comment }),
      });

      const responseData: any = await response.json();

      if (!response.ok) {
        setApiResult({
            sentiment: 'Error',
            error_message: responseData.error_message || responseData.error || `API request failed: ${response.statusText || response.status}`,
        });
      } else {
        setApiResult(responseData as SentimentApiResult);
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setApiResult({
        sentiment: 'Error',
        error_message: error.message || 'Could not connect to the sentiment service. Ensure the backend is running.',
      });
    } finally {
      setIsLoading(false);
      setOpenResultModal(true);
    }
  }

  const handleCloseModal = () => {
    setOpenResultModal(false);
    setComment('');
    pickRandomMovie();
  }

  if (!randomMovie) {
    return <div className="relative mt-[70px] z-3 flex items-center justify-center w-full text-white">Loading movie information...</div>;
  }

  return (
    <div className="relative mt-[70px] z-3 flex flex-col md:flex-row items-center justify-between w-full pl-[5%] pr-[5%] md:pl-[50px] md:pr-[100px] gap-8 text-white ">
      <div className="flex flex-col max-w-xl w-full text-white">
        <p className="text-2xl md:text-3xl mb-6 text-center md:text-left">{randomMovie.question} 🤔</p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type your thoughts here..."
          className="w-full p-4 rounded-xl bg-white/10 text-white shadow-md resize-none text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ring-1 ring-white/30"
          rows={4}
          disabled={isLoading}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || comment.trim() === ""}
          className="mt-4 self-center md:self-start bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-lg"
        >
          {isLoading ? 'Analyzing...' : 'Submit Opinion'}
        </button>
      </div>

      <div className="border-2 border-white/50 p-2 rounded-xl shadow-lg mt-8 md:mt-0">
        <img
          src={randomMovie.poster}
          alt={`${randomMovie.question.match(/'(.*?)'/)?.[1] || 'Movie'} Poster`}
          className="w-52 md:w-64 h-auto rounded-lg"
        />
      </div>
      
      {openResultModal && <div className="fixed top-0 left-0 z-40 w-screen h-screen bg-black opacity-[.85]"></div>}
      
      {openResultModal && apiResult && (
        <ResultModal 
          isOpen={openResultModal} 
          onClose={handleCloseModal} 
          result={apiResult}
        />
      )}
    </div>
  )
}