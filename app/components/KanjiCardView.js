"use client";
import { useState, useRef, useEffect } from "react";
import KanjiCard from "./Cards";

export default function KanjiCardView({ kanjiList, onBookmarkToggle, sound }) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [face, setFace] = useState(true);
    const prevLengthRef = useRef(kanjiList.length);

    useEffect(() => {
        const prevLength = prevLengthRef.current;
        const newLength = kanjiList.length;

        if (newLength === 0) {
            setCurrentIndex(0);
        } else if (currentIndex >= newLength) {
            setCurrentIndex(newLength - 1); // adjust if out of bounds
        } else if (newLength < prevLength) {
            // Only adjust if we're in Bookmarked mode and item removed
            setCurrentIndex((prev) => Math.min(prev, newLength - 1));
        }

        prevLengthRef.current = newLength;
    }, [kanjiList]);


    // Audios (optional)
    const flipAudio = typeof Audio !== "undefined" ? new Audio("/sounds/flipcard.mp3") : null;
    const turnAudio = typeof Audio !== "undefined" ? new Audio("/sounds/pageturn.mp3") : null;

    const handleNext = () => {
        if (sound && turnAudio) {
            turnAudio.currentTime = 0;
            turnAudio.play();
        }
        setCurrentIndex((prev) => (prev + 1) % kanjiList.length);
        setFace(true);
    };

    const handlePrevious = () => {
        if (sound && turnAudio) {
            turnAudio.currentTime = 0;
            turnAudio.play();
        }
        setCurrentIndex((prev) => (prev - 1 + kanjiList.length) % kanjiList.length);
        setFace(true);
    };

    const currentKanji = kanjiList[currentIndex];

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        const minSwipeDistance = 50;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > minSwipeDistance) handleNext();
        else if (distance < -minSwipeDistance) handlePrevious();
    };

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
                            sound={sound}// Pass onBookmarkToggle directly
                        />
                    </div>
                    <div className="hidden lg:flex gap-x-10 mt-4">
                        <button
                            onClick={handlePrevious}
                            className="p-2 bg-green-500 text-white rounded-lg"
                        >
                            ⬅️ Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-2 bg-green-500 text-white rounded-lg"
                        >
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