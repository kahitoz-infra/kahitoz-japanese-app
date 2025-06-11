"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import VocabCard from "./VocabCards";

const LS_KEYS = {
  all: "vocab_current_index_all",
  bookmarked: "vocab_current_index_bookmarked",
};

export default function VocabCardView({ vocabList, onBookmarkToggle, sound }) {
  const isBookmarkedView = useMemo(() => vocabList.every(k => k.marked), [vocabList]);
  const localStorageKey = isBookmarkedView ? LS_KEYS.bookmarked : LS_KEYS.all;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [face, setFace] = useState(true);
  const [readingLoading, setReadingLoading] = useState(true);
  const prevLengthRef = useRef(vocabList.length);
  // Audio files
  const flipAudio = typeof Audio !== "undefined" ? new Audio("/sounds/flipcard.mp3") : null;
  const turnAudio = typeof Audio !== "undefined" ? new Audio("/sounds/pageturn.mp3") : null;

  // Load initial index from localStorage when vocabList or view changes
  useEffect(() => {
    if (vocabList.length > 0) {
      const storedIndex = parseInt(localStorage.getItem(localStorageKey), 10);
      const validIndex = isNaN(storedIndex) ? 0 : Math.min(storedIndex, vocabList.length - 1);
      setCurrentIndex(validIndex);
    }
  }, [vocabList.length, localStorageKey]);
  

  // Keep currentIndex valid when list length changes
  useEffect(() => {
    const prevLength = prevLengthRef.current;
    const newLength = vocabList.length;

    if (newLength === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= newLength || newLength < prevLength) {
      setCurrentIndex(Math.min(currentIndex, newLength - 1));
    }

    prevLengthRef.current = newLength;
  }, [vocabList, currentIndex]);

  // Persist index to localStorage
    const updateIndex = (newIndex) => {
      localStorage.setItem(localStorageKey, newIndex.toString());
      setCurrentIndex(newIndex);
      setFace(true);
      setReadingLoading(true); // <-- trigger spinner early
    };
  

  // Navigation handlers
  const handleNext = () => {
    if (sound && turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    updateIndex((currentIndex + 1) % vocabList.length);
  };

  const handlePrevious = () => {
    if (sound && turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    updateIndex((currentIndex - 1 + vocabList.length) % vocabList.length);
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

  const currentvocab = vocabList[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full pt-8">
      {vocabList.length > 0 && currentvocab ? (
        <>
          <p className="text-xl mb-4">
            {currentIndex + 1} / {vocabList.length}
          </p>
          <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <VocabCard
            vocab={currentvocab}
            flipAudio={flipAudio}
            face={face}
            setFace={setFace}
            onBookmarkToggle={onBookmarkToggle}
            sound={sound}
            readingLoading={readingLoading}                   // pass down
            setReadingLoading={setReadingLoading}             // pass down
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
        <p className="text-white mt-8">No vocab found</p>
      )}
    </div>
  );
}
