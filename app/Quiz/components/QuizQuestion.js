'use client';

import { useState } from 'react';
import { formatOption, formatQuestion } from '../utils/formatOption';

export default function QuizQuestion({ question = "", options = [], name = "quiz", selectedOption, onSelect, type }) {


  const [selected, setSelected] = useState(null);


  return (
    <div className="mt-8 flex flex-col items-center px-4">
      {/* Question */}
      {formatQuestion(question, type)}

      {/* Options */}
      <div className="space-y-4 w-full max-w-xl">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200
              bg-[#faf9f6] dark:bg-[#2F2F2F] text-black dark:text-white
              shadow-[0px_-2px_8.3px_rgba(0,0,0,0.04)] dark:shadow-none
              ${selected === option ? 'border-2 border-[#FF5274] dark:border-[#F66538]' : ''}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected === option}
              onChange={() => {
                setSelected(option);
                onSelect(option); // 🔁 Notify parent of selection
              }}
              className="hidden"
            />


            {/* Custom Radio */}
            <span className="w-5 h-5 mr-4 rounded-full bg-[#ffffff] dark:bg-white flex items-center justify-center">
              {selected === option && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5274] dark:bg-[#F66538]"></span>
              )}
            </span>

            {/* ✅ Formatted option */}
            <span>{formatOption(option, type)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
