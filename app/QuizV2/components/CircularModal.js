'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowRight, Play, LoaderCircle } from 'lucide-react';
import { getAdaptiveQuiz } from '../utils/getAdaptiveQuiz';

export default function FabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // State for managing the quiz loading and data
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setsCompleted, setSetsCompleted] = useState(0);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const startAdaptiveQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdaptiveQuiz();
      setQuizData(data);
      // Once data is loaded, we can close the initial menu
      setIsOpen(false); 
    } catch (err) {
      setError('Failed to load quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFabClick = () => {
    if (selectedOption === 'adaptive') {
      startAdaptiveQuiz();
    } else if (selectedOption === 'custom') {
      // Placeholder for custom quiz logic
      alert('Custom quiz selected!');
    } else {
      // If no option is selected, just toggle the menu
      setIsOpen(!isOpen);
    }
  };
  
  // This function would be called when a user completes a set
  const handleSetComplete = () => {
      setSetsCompleted(prev => prev + 1);
  }

  // This function would reset the component to its initial state
  const resetQuiz = () => {
      setIsOpen(false);
      setSelectedOption(null);
      setQuizData(null);
      setIsLoading(false);
      setError(null);
      setSetsCompleted(0);
  }

  // If an option has been selected and we are loading or have data/error,
  // show the new "Play" button UI.
  if (selectedOption === 'adaptive' && (isLoading || quizData || error)) {
    const totalSets = quizData ? Object.keys(quizData.sets_data).length : 0;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <button
            className="w-32 h-32 rounded-full flex items-center justify-center bg-[#FFB8C6] dark:bg-[#FF6E41] text-[#1a1a1a] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            aria-label="Play quiz"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircle size={48} className="animate-spin" />
            ) : error ? (
              <span className="text-red-500 text-center p-2">!</span>
            ) : (
              <Play size={48} />
            )}
          </button>
          
          {error ? (
             <p className="text-white bg-red-500 px-4 py-2 rounded-md">{error}</p>
          ) : (
             <p className="text-white text-lg font-semibold">
                {setsCompleted} / {totalSets} Sets Completed
             </p>
          )}
          <button onClick={resetQuiz} className="text-white underline mt-4">Cancel</button>
        </div>
      </div>
    );
  }

  // Default FAB Menu view
  return (
    <div className="fixed bottom-32 right-2 z-50 flex flex-col items-center gap-4">
      {/* Menu Options */}
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <button
          onClick={() => handleOptionClick('custom')}
          className={`py-2 px-6 rounded-full shadow-md text-base transition-all duration-200
            ${selectedOption === 'custom'
              ? 'bg-[#FF6E41] text-[#1a1a1a] font-bold'
              : 'bg-white text-gray-800'
            }`}
        >
          Custom
        </button>
        <button
          onClick={() => handleOptionClick('adaptive')}
          className={`py-2 px-6 rounded-full shadow-md text-base transition-all duration-200
            ${selectedOption === 'adaptive'
              ? 'bg-[#FF6E41] text-[#1a1a1a] font-bold'
              : 'bg-white text-gray-800'
            }`}
        >
          Adaptive
        </button>
      </div>

      {/* Main Circular Button */}
      <button
        onClick={handleFabClick}
        className="w-16 h-16 rounded-full flex items-center justify-center bg-[#FFB8C6] dark:bg-[#FF6E41] text-[#1a1a1a] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        aria-label="Open menu"
      >
        {selectedOption ? (
          <ArrowRight size={32} />
        ) : (
          <Plus
            size={32}
            className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : 'rotate-0'
              }`}
          />
        )}
      </button>
    </div>
  );
}
