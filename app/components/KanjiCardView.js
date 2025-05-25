"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import KanjiCard from "./Cards";

const LS_KEYS = {
  all: "kanji_current_index_all",
  bookmarked: "kanji_current_index_bookmarked",
};

export default function KanjiCardView({ kanjiList, onBookmarkToggle, sound }) {
  const isBookmarkedView = useMemo(() => kanjiList.every(k => k.marked), [kanjiList]);
  const localStorageKey = isBookmarkedView ? LS_KEYS.bookmarked : LS_KEYS.all;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [face, setFace] = useState(true);
  const prevLengthRef = useRef(kanjiList.length);

  // Audio files
  const flipAudio = typeof Audio !== "undefined" ? new Audio("/sounds/flipcard.mp3") : null;
  const turnAudio = typeof Audio !== "undefined" ? new Audio("/sounds/pageturn.mp3") : null;

  // Load initial index from localStorage when kanjiList or view changes
  useEffect(() => {
    const storedIndex = parseInt(localStorage.getItem(localStorageKey), 10);
    setCurrentIndex(isNaN(storedIndex) ? 0 : Math.min(storedIndex, kanjiList.length - 1));
  }, [kanjiList, localStorageKey]);

  // Keep currentIndex valid when list length changes
  useEffect(() => {
    const prevLength = prevLengthRef.current;
    const newLength = kanjiList.length;

    if (newLength === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= newLength || newLength < prevLength) {
      setCurrentIndex(Math.min(currentIndex, newLength - 1));
    }

    prevLengthRef.current = newLength;
  }, [kanjiList, currentIndex]);

  // Persist index to localStorage
  const updateIndex = (newIndex) => {
    localStorage.setItem(localStorageKey, newIndex.toString());
    setCurrentIndex(newIndex);
    setFace(true);
  };

  // Navigation handlers
  const handleNext = () => {
    if (sound && turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    updateIndex((currentIndex + 1) % kanjiList.length);
  };

  const handlePrevious = () => {
    if (sound && turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    updateIndex((currentIndex - 1 + kanjiList.length) % kanjiList.length);
  };

  // Touch handlers
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const distance = touchStartX.current - touchEndX;

    if (distance > 50) handleNext();
    else if (distance < -50) handlePrevious();
  };

  const currentKanji = kanjiList[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full pt-8">
      {kanjiList.length > 0 && currentKanji ? (
        <>
          <p className="text-xl mb-4">
            {currentIndex + 1} / {kanjiList.length}
          </p>
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <KanjiCard
              kanji={currentKanji}
              flipAudio={flipAudio}
              face={face}
              setFace={setFace}
              onBookmarkToggle={onBookmarkToggle}
              sound={sound}
            />
          </div>
          <div className="hidden lg:flex gap-x-10 mt-4">
            <button onClick={handlePrevious} className="p-2 bg-green-500 text-white rounded-lg">
              ⬅️ Previous
            </button>
            <button onClick={handleNext} className="p-2 bg-green-500 text-white rounded-lg">
              Next ➡️
            </button>
          </div>
        </>
      ) : (
        <p className="text-white mt-8">No Kanji found</p>
      )}
    </div>
  );
}
