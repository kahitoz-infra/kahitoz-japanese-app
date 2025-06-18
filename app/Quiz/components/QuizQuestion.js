'use client';

import { useState } from 'react';

export default function QuizQuestion({ question = "", options = [], name = "quiz" }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mt-8 flex flex-col items-center px-4">
      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-4 w-full max-w-xl">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors duration-200
              bg-[#faf9f6] dark:bg-[#2F2F2F] text-black dark:text-white
              shadow-[0px_-2px_8.3px_rgba(0,0,0,0.04)] dark:shadow-none`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="hidden"
            />
            {/* Custom Radio */}
           <span className="w-5 h-5 mr-4 rounded-full bg-[#ffffff] dark:bg-white flex items-center justify-center">
              {selected === option && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5274] dark:bg-[#F66538]"></span>
              )}
            </span>

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
