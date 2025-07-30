'use client';

import { useState } from 'react';

export default function Blank({ question = "", name = "fill-blank", onAnswer = () => {} }) {
  const [answer, setAnswer] = useState("");

  const handleChange = (e) => {
    const input = e.target.value;
    setAnswer(input);
    onAnswer(input);
  };

  return (
    <div className="mt-8 flex flex-col items-center px-4">
      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
        {question}
      </h2>

      {/* Input */}
      <input
        type="text"
        name={name}
        value={answer}
        onChange={handleChange}
        placeholder="Type your answer here"
        className="w-full max-w-xl px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#faf9f6] dark:bg-[#2F2F2F] text-black dark:text-white shadow-[0px_-2px_8.3px_rgba(0,0,0,0.04)] dark:shadow-none focus:outline-none focus:ring-2 focus:ring-[#FF5274] dark:focus:ring-[#F66538] transition"
      />
    </div>
  );
}
