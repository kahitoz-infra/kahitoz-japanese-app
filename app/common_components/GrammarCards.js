"use client";

import React, { useState, useRef, useEffect } from "react";
import * as wanakana from "wanakana"; // Correct import for wanakana

export default function GrammarCard({ data, onSwipe }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const startX = useRef(0);

  useEffect(() => setIsFlipped(false), [data]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff > 50) onSwipe("right");
    else if (diff < -50) onSwipe("left");
  };

  if (!data) return null;

  const hiragana = wanakana.toRomaji(data.grammar); // ← Convert here

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-[360px] h-[26rem] my-8 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped((f) => !f)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 dark:bg-[#2F2F2F] dark:text-white bg-white text-black"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-sm text-right fixed top-1 right-2">
            <strong>Level:</strong> {data.level}
          </div>
          <div className="h-auto w-full text-center">
            <div className="text-3xl font-bold">{data.grammar}</div>
            <div className="text-xl mt-2">{hiragana}</div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 dark:bg-[#2F2F2F] dark:text-white bg-white text-black px-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <strong>Meaning:</strong> {data.furigana}
          </div>
        </div>
      </div>
    </div>
  );
}
