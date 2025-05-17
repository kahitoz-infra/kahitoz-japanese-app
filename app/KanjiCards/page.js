"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import KanjiCard from "../componets/Cards";
import "./page.css";
import Image from "next/image";

export default function KanjiCards() {
  const [label, setLabel] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [kanjiList, setKanjiList] = useState([]);
  const [allKanjiList, setAllKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [labelLoad, setLabelLoad] = useState(true);
  const [face, setFace] = useState(true);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const flipAudio = typeof Audio !== "undefined" ? new Audio("/sounds/flipcard.mp3") : null;
  const turnAudio = typeof Audio !== "undefined" ? new Audio("/sounds/pageturn.mp3") : null;

  useEffect(() => {
    setFace(true);
  }, [currentIndex]);

  // Fetch tags (labels)
  useEffect(() => {
    const fetchLabels = async () => {
      const response = await fetch(`https://apizenkanji.kahitoz.com/v1/tags`);
      const data = await response.json();
      setLabel(data.result);
      setLabelLoad(false);
    };
    fetchLabels();
  }, []);

  // Fetch all Kanji when label changes
  useEffect(() => {
    const fetchKanji = async () => {
      if (selectedLabel) {
        const response = await fetch("https://apizenkanji.kahitoz.com/v1/flagged_kanjis?user_id=1");
        const data = await response.json();
        setAllKanjiList(data);
        applyFilters(data, selectedLabel, showBookmarkedOnly);
      }
    };
    fetchKanji();
  }, [selectedLabel, showBookmarkedOnly]);

  // Re-filter when bookmark toggle changes
  useEffect(() => {
    applyFilters(allKanjiList, selectedLabel, showBookmarkedOnly);
  }, [allKanjiList, selectedLabel, showBookmarkedOnly]);

  const applyFilters = (data, label, bookmarkedOnly, preserveCurrent = true) => {
    const filtered = data.filter((item) => {
      const matchLabel = label === "All" || item.tags === label;
      const matchBookmark = !bookmarkedOnly || item.marked;
      return matchLabel && matchBookmark;
    });

    setKanjiList(filtered);

    if (
        !preserveCurrent ||
        !filtered.some((item) => item.uid === kanjiList[currentIndex]?.uid)
    ) {
      setCurrentIndex(0);
    }
  };


  const handleLabelChange = (e) => {
    setSelectedLabel(e.target.value);
  };

  const handleBookmarkChange = (e) => {
    setShowBookmarkedOnly(e.target.value === "Bookmarked");
  };

  const handleNext = () => {
    if (turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % kanjiList.length);
  };

  const handlePrevious = () => {
    if (turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + kanjiList.length) % kanjiList.length);
  };

  const currentKanji = kanjiList[currentIndex];
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const minSwipeDistance = 50;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrevious();
  };

  const handleBookmarkToggle = async (kanjiId, newStatus) => {
    try {
      const response = await fetch("https://apizenkanji.kahitoz.com/v1/update_flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation_type: newStatus,
          kanji_id: kanjiId,
          user_id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }

      // Update in-place in allKanjiList and reapply filters
      const updatedList = allKanjiList.map((k) =>
          k.uid === kanjiId ? { ...k, marked: newStatus } : k
      );
      setAllKanjiList(updatedList);
      applyFilters(updatedList, selectedLabel, showBookmarkedOnly);
    } catch (error) {
      console.error("Bookmark update failed:", error);
    }
  };

  return (
      <div className="flex flex-col h-screen w-screen">
        <div className="fixed top-0 left-0 right-0 z-10 gap-x-2 p-6 mt-2">
          <div className="flex w-full justify-between">
            <Link href="/" passHref>
              <Image src={"icons/back.svg"} width={40} height={40} alt="back" />
            </Link>

            <div className="flex items-center justify-center space-x-2">
              {/* Fixed dropdown for 'Cards' */}
              <select
                  value={"Cards"}
                  className="border-none rounded-lg w-16 text-center text-black bg-white dark:bg-black dark:text-white"
                  disabled
              >
                <option value="">Cards</option>
              </select>

              <Image src={"icons/rightarrow.svg"} alt={"rightarrow"} width={20} height={20} />

              {/* Level Select */}
              <select
                  value={selectedLabel}
                  onChange={handleLabelChange}
                  className="border-none rounded-lg w-24 text-center text-black bg-white dark:bg-black dark:text-white"
              >
                <option value="">Level</option>
                {!labelLoad &&
                    label.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                    ))}
              </select>

              <Image src={"icons/rightarrow.svg"} alt={"rightarrow"} width={20} height={20} />

              {/* Bookmark Filter Select */}
              <select
                  value={showBookmarkedOnly ? "Bookmarked" : "All"}
                  onChange={handleBookmarkChange}
                  className="border-none rounded-lg w-28 text-center text-black bg-white dark:bg-black dark:text-white"
              >
                <option value="All">All</option>
                <option value="Bookmarked">Bookmarked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          {kanjiList.length > 0 && currentKanji ? (
              <>
                <p className="text-white text-xl mb-4 mt-4">
                  {currentIndex + 1} / {kanjiList.length}
                </p>

                <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <KanjiCard
                      kanji={currentKanji}
                      flipAudio={flipAudio}
                      face={face}
                      setFace={setFace}
                      onBookmarkToggle={handleBookmarkToggle}
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
              <p className="text-white mt-8">Please select a label to load kanji cards.</p>
          )}
        </div>
      </div>
  );
}
