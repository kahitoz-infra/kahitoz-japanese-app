'use client';

import { useRef, useState } from 'react';

export default function MatchColumn({ question = "", leftItems = [], rightItems = [], name = "match" }) {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({});
  const containerRef = useRef(null);
  const boxRefs = useRef({}); // Holds refs for left and right items

  const handleLeftClick = (item) => {
    if (matches[item]) {
      // Already matched → unmatch and select again
      setMatches((prev) => {
        const updated = { ...prev };
        delete updated[item];
        return updated;
      });
      setSelectedLeft(item);
    } else {
      setSelectedLeft(item);
    }
  };

  const handleRightClick = (item) => {
    // Check if this right item is already matched
    const matchedLeft = Object.entries(matches).find(([_, right]) => right === item)?.[0];

    if (matchedLeft) {
      // Unmatch it
      setMatches((prev) => {
        const updated = { ...prev };
        delete updated[matchedLeft];
        return updated;
      });
      return;
    }

    if (!selectedLeft) return;

    // Match selected left with this right
    setMatches((prev) => ({
      ...prev,
      [selectedLeft]: item,
    }));
    setSelectedLeft(null);
  };

  const getCenter = (id) => {
    const el = boxRefs.current[id];
    if (!el || !containerRef.current) return null;

    const rect = el.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  };

  const matchedLines = Object.entries(matches).map(([left, right]) => {
    const leftPos = getCenter(`left-${left}`);
    const rightPos = getCenter(`right-${right}`);

    if (!leftPos || !rightPos) return null;

    return (
      <line
        key={`${left}-${right}`}
        x1={leftPos.x}
        y1={leftPos.y}
        x2={rightPos.x}
        y2={rightPos.y}
        stroke="#10b981"
        strokeWidth="2"
      />
    );
  });

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-10" ref={containerRef}>
      {/* SVG lines between matched items */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {matchedLines}
      </svg>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white z-10 relative">
        {question}
      </h2>

      {/* Column Grid */}
      <div className="grid grid-cols-2 gap-32 relative z-10">
        {/* Column A (Numbers) */}
        <div className="flex flex-col gap-4 items-end">
          {leftItems.map((item) => (
            <div
              key={item}
              ref={(el) => (boxRefs.current[`left-${item}`] = el)}
              onClick={() => handleLeftClick(item)}
              className={`cursor-pointer px-4 py-2 rounded-md w-24 text-center shadow-md transition
                ${selectedLeft === item
                  ? 'bg-pink-400 dark:bg-orange-800 text-black dark:text-white'
                  : matches[item]
                  ? 'bg-green-500 text-white'
                  : 'bg-[#faf9f6] dark:bg-[#2F2F2F] text-black dark:text-white'}
              `}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Column B (Alphabets) */}
        <div className="flex flex-col gap-4 items-start">
          {rightItems.map((item) => {
            const matchedLeft = Object.entries(matches).find(([_, right]) => right === item)?.[0];

            return (
              <div
                key={item}
                ref={(el) => (boxRefs.current[`right-${item}`] = el)}
                onClick={() => handleRightClick(item)}
                className={`cursor-pointer px-4 py-2 rounded-md w-24 text-center shadow-md transition
                  ${matchedLeft
                    ? 'bg-green-500 text-white'
                    : 'bg-[#faf9f6] dark:bg-[#2F2F2F] text-black dark:text-white'}
                `}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
