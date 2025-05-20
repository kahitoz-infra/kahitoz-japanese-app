"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import KanjiCard from "../componets/Cards";
import "./page.css";
import Image from "next/image";
import KanjiList from "@/app/KanjiList/Table";

export default function KanjiCards() {
  const [label, setLabel] = useState([]);
  const [kanjiList, setKanjiList] = useState([]);
  const [allKanjiList, setAllKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [labelLoad, setLabelLoad] = useState(true);
  const [face, setFace] = useState(true);
  const [selectedView, setSelectedView] = useState("Cards");
  const [selectedLabel, setSelectedLabel] = useState("N5");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const flipAudio = typeof Audio !== "undefined" ? new Audio("/sounds/flipcard.mp3") : null;
  const turnAudio = typeof Audio !== "undefined" ? new Audio("/sounds/pageturn.mp3") : null;

  const checkAPIHealth = async () => {
    try {
      const response = await fetch("https://apizenkanji.kahitoz.com/v1/health");
      return response.status === 200;
    } catch {
      console.log("This is false")
      return false;
    }
  };

  // Restore filters from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLabel = localStorage.getItem("selectedLabel");
      const savedBookmark = localStorage.getItem("bookmarkFilter");
      if (savedLabel) setSelectedLabel(savedLabel);
      if (savedBookmark) setShowBookmarkedOnly(savedBookmark === "Bookmarked");
    }
  }, []);

  useEffect(() => {
    setFace(true);
  }, [currentIndex]);

  // Load labels
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch("https://apizenkanji.kahitoz.com/v1/tags");
        const data = await response.json();
        setLabel(data.result);
      } catch (e) {
        console.warn("Failed to fetch labels", e);
      } finally {
        setLabelLoad(false);
      }
    };
    fetchLabels();
  }, []);

  // Load Kanji data
  useEffect(() => {
    const fetchKanji = async () => {
      const lastFetch = localStorage.getItem("kanjiLastFetch");
      const now = new Date().getTime();
      const twelveHours = 12 * 60 * 60 * 1000;

      const shouldFetch = !lastFetch || now - parseInt(lastFetch) > twelveHours;

      if (shouldFetch) {
        const healthy = await checkAPIHealth();

        if (healthy) {
          try {
            const response = await fetch("https://apizenkanji.kahitoz.com/v1/flagged_kanjis?user_id=1");
            const data = await response.json();

            localStorage.setItem("kanjiData", JSON.stringify(data));
            localStorage.setItem("kanjiLastFetch", now.toString());
            setAllKanjiList(data);
            applyFilters(data, selectedLabel, showBookmarkedOnly);
          } catch (e) {
            console.error("Failed to fetch from API", e);
          }
        } else {
          const cached = localStorage.getItem("kanjiData");
          if (cached) {
            const parsed = JSON.parse(cached);
            setAllKanjiList(parsed);
            applyFilters(parsed, selectedLabel, showBookmarkedOnly);
          }
        }
      } else {
        const cached = localStorage.getItem("kanjiData");
        if (cached) {
          const parsed = JSON.parse(cached);
          setAllKanjiList(parsed);
          applyFilters(parsed, selectedLabel, showBookmarkedOnly);
        }
      }
    };

    fetchKanji();
  }, [selectedLabel, showBookmarkedOnly]);


  useEffect(() => {
    applyFilters(allKanjiList, selectedLabel, showBookmarkedOnly);
  }, [allKanjiList, selectedLabel, showBookmarkedOnly]);

  // Sync offline bookmarks
  useEffect(() => {
    const syncBookmarks = async () => {
      const healthy = await checkAPIHealth();
      if (!healthy) return;

      const localUpdates = JSON.parse(localStorage.getItem("immediateBookmarks") || "{}");

      for (const [kanjiId, status] of Object.entries(localUpdates)) {
        try {
          const response = await fetch("https://apizenkanji.kahitoz.com/v1/update_flag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operation_type: status,
              kanji_id: parseInt(kanjiId),
              user_id: 1,
            }),
          });

          if (response.ok) {
            delete localUpdates[kanjiId];
          }
        } catch (e) {
          console.warn("Sync failed for", kanjiId);
        }
      }

      localStorage.setItem("immediateBookmarks", JSON.stringify(localUpdates));
    };

    // Initial sync
    syncBookmarks();

    // Retry every 1 minute
    const interval = setInterval(syncBookmarks, 60000);

    return () => clearInterval(interval);
  }, []);


  const applyFilters = (data, label, bookmarkedOnly, preserveCurrent = true) => {
    const filtered = data.filter((item) => {
      const matchLabel = label === "All" || item.tags === label;
      const matchBookmark = !bookmarkedOnly || item.marked;
      return matchLabel && matchBookmark;
    });

    setKanjiList(filtered);

    if (!preserveCurrent || !filtered.some((item) => item.uid === kanjiList[currentIndex]?.uid)) {
      setCurrentIndex(0);
    }
  };

  const handleLabelChange = (e) => {
    const value = e.target.value;
    setSelectedLabel(value);
    localStorage.setItem("selectedLabel", value);
  };

  const handleBookmarkChange = (e) => {
    const value = e.target.value;
    const isBookmarked = value === "Bookmarked";
    setShowBookmarkedOnly(isBookmarked);
    localStorage.setItem("bookmarkFilter", value);
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

  const handleBookmarkToggle = async (kanjiId, newStatus) => {
    const updatedList = allKanjiList.map((k) =>
        k.uid === kanjiId ? { ...k, marked: newStatus } : k
    );

    localStorage.setItem("kanjiData", JSON.stringify(updatedList));
    const immediateBookmarks = JSON.parse(localStorage.getItem("immediateBookmarks") || "{}");
    immediateBookmarks[kanjiId] = newStatus;
    localStorage.setItem("immediateBookmarks", JSON.stringify(immediateBookmarks));

    setAllKanjiList(updatedList);
    applyFilters(updatedList, selectedLabel, showBookmarkedOnly);

    const healthy = await checkAPIHealth();
    if (healthy) {
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

        if (response.ok) {
          delete immediateBookmarks[kanjiId];
          localStorage.setItem("immediateBookmarks", JSON.stringify(immediateBookmarks));
        }
      } catch (e) {
        console.warn("API failed, kept in local cache.");
      }
    }
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

  return (
      <div className="flex flex-col h-screen w-screen">
        <div className="fixed top-0 left-0 right-0 z-10 gap-x-2 p-6 mt-2">
          <div className="flex w-full justify-between">
            <Link href="/" passHref>
              <Image src={"icons/back.svg"} width={40} height={40} alt="back" />
            </Link>

            <div className="flex items-center justify-center space-x-2">
              <select value={"Cards"} disabled className="border-none rounded-lg w-16 text-center text-black bg-white dark:bg-black dark:text-white">
                <option value="">Cards</option>
              </select>

              <Image src={"icons/rightarrow.svg"} alt={"rightarrow"} width={20} height={20} />

              <select value={selectedLabel} onChange={handleLabelChange} className="border-none rounded-lg w-24 text-center text-black bg-white dark:bg-black dark:text-white">
                <option value="">Level</option>
                {!labelLoad &&
                    label.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                    ))}
              </select>

              <Image src={"icons/rightarrow.svg"} alt={"rightarrow"} width={20} height={20} />

              <select value={showBookmarkedOnly ? "Bookmarked" : "All"} onChange={handleBookmarkChange} className="border-none rounded-lg w-28 text-center text-black bg-white dark:bg-black dark:text-white">
                <option value="All">All</option>
                <option value="Bookmarked">Bookmarked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          {kanjiList.length > 0 && currentKanji ? (
              <>
                <p className=" text-xl mb-4 mt-4">
                  {currentIndex + 1} / {kanjiList.length}
                </p>

                <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <KanjiCard kanji={currentKanji} flipAudio={flipAudio} face={face} setFace={setFace} onBookmarkToggle={handleBookmarkToggle} />
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
