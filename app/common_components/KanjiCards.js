"use client";

import React, { useState, useRef, useEffect } from "react";
import * as wanakana from "wanakana";

export default function KanjiCard({ data, onSwipe }) {
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

  // Handle loading state or data not yet available
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-[26rem]">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Parse onyomi safely
  let onyomiList = [];
  try {
    const parsed =
      typeof data.onyomi === "string" ? JSON.parse(data.onyomi) : data.onyomi;
    onyomiList = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    onyomiList = [];
  }

  // Parse kunyomi safely
  let kunyomiList = [];
  try {
    const parsed =
      typeof data.kunyomi === "string"
        ? JSON.parse(data.kunyomi)
        : data.kunyomi;
    kunyomiList = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    kunyomiList = [];
  }

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
            <strong>Level:</strong> {data.tags}
          </div>
          <div className="h-auto w-full text-center">
            <div className="font-semibold" style={{ fontSize: "150px" }}>
              {data.kanji}
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 dark:bg-[#2F2F2F] dark:text-white bg-white text-black px-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            <strong>Onyomi: </strong>
            {onyomiList.length > 0 ? (
              onyomiList.map((reading, i) => (
                <span key={i}>
                  {reading} ({wanakana.toRomaji(reading)})
                  {i < onyomiList.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              <span>—</span>
            )}
          </div>
          <div style={{ fontSize: "24px", textAlign: "center" }}>
            <strong>Kunyomi: </strong>
            {kunyomiList.length > 0 ? (
              kunyomiList.map((reading, i) => (
                <span key={i}>
                  {reading} ({wanakana.toRomaji(reading)})
                  {i < kunyomiList.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              <span>—</span>
            )}
          </div>
          <div style={{ fontSize: "24px", textAlign: "center" }}>
            <strong>Meaning: </strong> {data.english}
          </div>
        </div>
      </div>
    </div>
  );
}
