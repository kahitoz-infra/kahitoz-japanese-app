'use client';

import { useState } from 'react';
import { formatOption, formatQuestion } from '../utils/formatOption';

export default function QuizQuestion({
  question = '',
  options = [],
  name = 'quiz',
  selectedOption,
  onSelect,
  type,
}) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mt-8 flex flex-col items-center px-4">
      {/* Question */}
      {formatQuestion(question, type)}

      {/* Options */}
      <div className="space-y-4 w-full max-w-xl">
        {options.map((option, index) => {
          const isSelected = selected === option;
          return (
            <label
              key={index}
              className={`flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer transition-colors duration-200
                bg-[#faf9f6] dark:bg-[#2F2F2F] text-black dark:text-white
                shadow-[0px_-2px_8.3px_rgba(0,0,0,0.04)] dark:shadow-none
                ${isSelected ? 'border-2 border-[#FF5274] dark:border-[#F66538]' : 'border border-transparent'}
              `}
            >
              {/* Hidden Radio */}
              <input
                type="radio"
                name={name}
                value={option}
                checked={isSelected}
                onChange={() => {
                  setSelected(option);
                  onSelect(option);
                }}
                className="hidden"
              />

              {/* Custom Radio */}
              <span className="min-w-[20px] min-h-[20px] w-5 h-5 rounded-full border border-gray-400 dark:border-white flex items-center justify-center">
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5274] dark:bg-[#F66538]" />
                )}
              </span>

              {/* Option Text */}
              <span className="flex-1 text-sm sm:text-base leading-relaxed">
                {formatOption(option, type)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
