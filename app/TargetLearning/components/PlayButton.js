'use client';
import React from 'react';
import { Play } from 'lucide-react';

function PlayButton({ progress = 0, onClick }) {
  const radius = 32;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-20 h-20" onClick={onClick}>
      {/* Circular Progress Ring */}
      <svg
        height="100%"
        width="100%"
        className="rotate-[-90deg] absolute top-0 left-0 pointer-events-none"
      >
        {/* Empty track */}
        <circle
          stroke="transparent"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="40"
          cy="40"
        />
        {/* Progress circle */}
        <circle
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx="40"
          cy="40"
          className="stroke-[#FF5274] dark:stroke-[#F66538]"
        />
      </svg>

      {/* Play Button */}
      
      <div className="w-14 h-14 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-white dark:bg-[#222222]">
        <Play className="text-white w-6 h-6" />
      </div>
    </div>
  );
}

export default PlayButton;
