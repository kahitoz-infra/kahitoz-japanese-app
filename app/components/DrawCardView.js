"use client";
import DrawCard from "./DrawCards";
import { useState, useRef, useEffect, useMemo } from "react";
import { toRomaji } from "wanakana";

const LS_KEYS = {
    all: "kanji_current_index_all",
    bookmarked: "kanji_current_index_bookmarked",
};

export default function DrawCardView({ kanjiList, onBookmarkToggle, sound }) {
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

            <div className="text-sm flex overflow-x-auto whitespace-nowrap w-64 lg:w-full  mb-2">
                <p className="text-center mr-4">
                    Onyomi: {JSON.parse(currentKanji.onyomi).join(", ")} (
                    {JSON.parse(currentKanji.onyomi).map(reading => toRomaji(reading)).join(", ")}
                    )
                </p>
                <p className="text-center mr-4">
                    Kunyomi: {JSON.parse(currentKanji.kunyomi).join(", ")} (
                    {JSON.parse(currentKanji.kunyomi).map(reading => toRomaji(reading)).join(", ")}
                    )
                </p>
                <p className="text-center">
                    Meaning: {currentKanji.english}
                </p>
            </div>


            {kanjiList.length > 0 && currentKanji ? (
                <>

                    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                        <DrawCard
                            kanji={currentKanji}
                            flipAudio={flipAudio}
                            face={face}
                            setFace={setFace}
                            onBookmarkToggle={onBookmarkToggle}
                            sound={sound}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />

                    </div>
                    <p className="text-xl mt-8">
                        {currentIndex + 1} / {kanjiList.length}
                    </p>

                </>
            ) : (
                <p className="text-white mt-4">No Kanji found</p>
            )}
        </div>
    );
}
