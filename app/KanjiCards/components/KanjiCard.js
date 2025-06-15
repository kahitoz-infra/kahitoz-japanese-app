// components/KanjiCard.js
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { toRomaji } from "wanakana";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Helper function to get Romaji
function getRomaji(onyomi, kunyomi) {
  const ony = onyomi ? JSON.parse(onyomi) : [];
  const kun = kunyomi ? JSON.parse(kunyomi) : [];
  const romajiList = Array.from(new Set([...ony, ...kun].map(s => toRomaji(s))));
  return romajiList.length ? romajiList.join(", ") : "-";
}

export default function KanjiCard({ kanjiList, onCurrentKanjiChange }) {
  const [currentIndex, setCurrentIndex] = useState(0); // Internal index for navigation
  const [isFlipped, setIsFlipped] = useState(false); // Internal state for flipping

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Reset current index and flip state when the kanjiList (filteredList) changes
  // This is crucial because a new filter/sort means we start from the beginning.
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    // Report the first kanji to the parent immediately
    if (kanjiList.length > 0) {
      onCurrentKanjiChange(kanjiList[0]);
    } else {
      onCurrentKanjiChange({}); // Clear current kanji if list is empty
    }
  }, [kanjiList, onCurrentKanjiChange]);

  // Report the current kanji to the parent whenever currentIndex changes
  useEffect(() => {
    if (kanjiList.length > 0) {
      onCurrentKanjiChange(kanjiList[currentIndex]);
    }
  }, [currentIndex, kanjiList, onCurrentKanjiChange]);


  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % kanjiList.length);
    setIsFlipped(false); // Reset flip state when moving to next card
  }, [kanjiList.length]);

  const goBack = useCallback(() => {
    setCurrentIndex(i => (i - 1 + kanjiList.length) % kanjiList.length);
    setIsFlipped(false); // Reset flip state when moving to previous card
  }, [kanjiList.length]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goBack();
    }
  }, [goNext, goBack]);

  const currentKanji = kanjiList[currentIndex] || {};

  if (kanjiList.length === 0) {
    // Parent handles the main loading spinner for raw data.
    // This state means no cards match the current filter.
    return (
      <div className="w-full flex justify-center items-center h-[26rem] bg-white dark:bg-[#292b2d] text-gray-500 dark:text-gray-400">
        No vocab found with current filters.
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full max-w-[360px] h-[26rem] my-8" style={{ perspective: "1000px" }}
           onClick={() => setIsFlipped(f => !f)} // Internal click handler for flipping
           onTouchStart={handleTouchStart}
           onTouchEnd={handleTouchEnd}>
        <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          {/* Front of the card */}
          <div className="absolute w-full h-full flex items-center justify-center text-[10rem] rounded-2xl border-2 bg-white dark:bg-[#292b2d]" style={{ backfaceVisibility: "hidden" }}>
            {currentKanji.kanji}
          </div>
          {/* Back of the card */}
          <div className="absolute w-full h-full flex flex-col justify-center items-center text-center p-4 rounded-2xl border-2 bg-white dark:bg-[#292b2d]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div className="mb-2"><strong>Onyomi:</strong> {currentKanji.onyomi ? JSON.parse(currentKanji.onyomi).join(", ") : "-"}</div>
            <div className="mb-2"><strong>Kunyomi:</strong> {currentKanji.kunyomi ? JSON.parse(currentKanji.kunyomi).join(", ") : "-"}</div>
            <div className="mb-2"><strong>Romaji:</strong> {getRomaji(currentKanji.onyomi, currentKanji.kunyomi)}</div>
            <div className="mb-2"><strong>JLPT:</strong> {currentKanji.tags ? currentKanji.tags.split(",")[0] : "-"}</div>
            <div><strong>Meaning:</strong> {currentKanji.english || "-"}</div>
          </div>
        </div>
      </div>

      {/* Navigation buttons are now part of KanjiCard */}
      {kanjiList.length > 0 && (
        <div className="flex justify-center items-center gap-8 mt-4">
          <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full"><ArrowLeft /></button>
          <div className="text-xl font-bold">{`${currentIndex + 1} / ${kanjiList.length}`}</div>
          <button onClick={goNext} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full"><ArrowRight /></button>
        </div>
      )}
    </>
  );
}