// components/VocabCard.js
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { toRomaji, toHiragana } from "wanakana";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { authFetch } from "@/app/middleware";

// Helper function to get Romaji
function getRomaji(onyomi, kunyomi) {
  const ony = onyomi ? JSON.parse(onyomi) : [];
  const kun = kunyomi ? JSON.parse(kunyomi) : [];
  const romajiList = Array.from(new Set([...ony, ...kun].map(s => toRomaji(s))));
  return romajiList.length ? romajiList.join(", ") : "-";
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VocabCard({ vocabList, onCurrentVocabChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [otherReadings, setOtherReadings] = useState([]);
  const [loadingOtherReadings, setLoadingOtherReadings] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const currentVocab = vocabList[currentIndex] || {};

  // Reset index on new vocabList
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    if (vocabList.length > 0) {
      onCurrentVocabChange(vocabList[0]);
    } else {
      onCurrentVocabChange({});
    }
  }, [vocabList, onCurrentVocabChange]);

  // Notify parent on index change
  useEffect(() => {
    if (vocabList.length > 0) {
      onCurrentVocabChange(vocabList[currentIndex]);
    }
  }, [currentIndex, vocabList, onCurrentVocabChange]);

  // Only fetch readings when card is flipped
  useEffect(() => {
    if (!isFlipped || !currentVocab.word || !currentVocab.furigana) return;

    const cacheKey = `readings_${currentVocab.word}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

    const useCache = cached && Date.now() - cached.timestamp < CACHE_TTL;

    const applyReadings = (readings) => {
      setOtherReadings(
        readings.map((r) => ({ reading: r, romaji: toRomaji(r) }))
      );
      setLoadingOtherReadings(false);
    };

    if (useCache) {
      applyReadings(cached.data);
      return;
    }

    (async () => {
      setLoadingOtherReadings(true);
      try {
        const res = await authFetch(
          `${API_URL}/readings?word=${encodeURIComponent(currentVocab.word)}&formal=${encodeURIComponent(currentVocab.furigana)}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { readings } = await res.json();
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: readings })
        );
        applyReadings(readings);
      } catch (err) {
        console.error("Reading fetch failed:", err);
        setOtherReadings([]);
        setLoadingOtherReadings(false);
      }
    })();
  }, [isFlipped, currentVocab.word, currentVocab.furigana]);

  // Optional: Clear readings when card is flipped back to front
  useEffect(() => {
    if (!isFlipped) {
      setOtherReadings([]);
      setLoadingOtherReadings(false);
    }
  }, [isFlipped]);

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % vocabList.length);
    setIsFlipped(false);
  }, [vocabList.length]);

  const goBack = useCallback(() => {
    setCurrentIndex(i => (i - 1 + vocabList.length) % vocabList.length);
    setIsFlipped(false);
  }, [vocabList.length]);

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

  if (vocabList.length === 0) {
    return (
      <div className="w-full flex justify-center items-center h-[26rem] bg-white dark:bg-[#292b2d] text-gray-500 dark:text-gray-400">
        No vocab found with current filters.
      </div>
    );
  }

  return (
    <>
      <div
        className="relative w-full max-w-[360px] h-[26rem] my-8"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(f => !f)}
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
          {/* FRONT */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 bg-white dark:bg-[#292b2d]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-7xl font-bold">{currentVocab.word || "?"}</div>
            <div className="text-xl mt-2">{currentVocab.furigana || ""}</div>
            <div className="text-xl text-gray-700 dark:text-gray-300">
              {toHiragana(currentVocab.furigana || "")}
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute w-full h-full flex items-center justify-center rounded-2xl border-2 bg-white dark:bg-[#292b2d]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-2xl w-full px-4 py-4 overflow-y-auto max-h-full space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="text-sm text-right">
  <strong>Level:</strong> {currentVocab.level || "-"}
</div>

              <div>
                <strong>Meaning:</strong> {currentVocab.meaning || "-"}
              </div>
              <div>
                <strong>Kanji Used:</strong> {currentVocab.kanji_type || "-"}
              </div>
              
              <div className="mt-4">
                <p className="text-md font-bold text-center mb-2">Other Readings</p>

                {loadingOtherReadings ? (
                  <p className="text-center text-sm italic text-gray-400">Loading...</p>
                ) : otherReadings.length > 0 ? (
                  otherReadings.map(({ reading, romaji }) => (
                    <div key={reading} className="text-center mb-3">
                      <p className="text-lg text-gray-800 dark:text-gray-100">{toHiragana(reading)}</p>
                      <p className="text-sm text-gray-500 italic">{romaji}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm italic text-gray-400">No other readings found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {vocabList.length > 0 && (
        <div className="flex justify-center items-center gap-8 mt-4">
          <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
            <ArrowLeft />
          </button>
          <div className="text-xl font-bold">{`${currentIndex + 1} / ${vocabList.length}`}</div>
          <button onClick={goNext} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
            <ArrowRight />
          </button>
        </div>
      )}
    </>
  );
}
