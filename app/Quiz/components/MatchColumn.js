'use client';

import { useState } from 'react';

export default function MatchColumn({ question = "", leftItems = [], rightItems = [], name = "match" }) {
  const [matches, setMatches] = useState({});

  const handleChange = (leftItem, rightItem) => {
    setMatches((prev) => ({
      ...prev,
      [leftItem]: rightItem,
    }));
  };

  return (
    <div className="mt-8 flex flex-col items-center px-4">
      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
        {question}
      </h2>

      {/* Matching Columns */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        <div className="text-center font-semibold text-black dark:text-white">Column A</div>
        <div className="text-center font-semibold text-black dark:text-white">Column B</div>

        {leftItems.map((leftItem, index) => (
          <div key={index} className="flex items-center justify-between col-span-2 bg-[#faf9f6] dark:bg-[#2F2F2F] p-3 rounded-xl shadow-sm">
            <div className="text-black dark:text-white font-medium">{leftItem}</div>
            <select
              className="ml-4 p-2 rounded-md bg-white dark:bg-[#2F2F2F] text-black dark:text-white border"
              value={matches[leftItem] || ''}
              onChange={(e) => handleChange(leftItem, e.target.value)}
            >
              <option value="">Select</option>
              {rightItems.map((right, idx) => (
                <option key={idx} value={right}>
                  {right}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
