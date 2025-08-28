'use client';

import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

export default function FabMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleFabClick = () => {
    if (selectedOption) {
      alert(`Option selected: ${selectedOption}`);
      setIsOpen(false);
      setSelectedOption(null);
    } else {
      setIsOpen(!isOpen);
    }
  };

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