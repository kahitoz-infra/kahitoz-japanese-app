"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Shuffle,
} from "lucide-react";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { authFetch } from "../middleware";
import { toRomaji } from "wanakana";

const KanjiAPI = process.env.NEXT_PUBLIC_API_URL;
const BOOKMARK_SYNC_API = "https://apizenkanji.kahitoz.com/v1/update_flag";

// Helper function to derive Romaji using wanakana
const getRomaji = (onyomi, kunyomi) => {
  const onyomiArr = onyomi ? JSON.parse(onyomi) : [];
  const kunyomiArr = kunyomi ? JSON.parse(kunyomi) : [];

  const onyomiRomaji = onyomiArr.map((s) => toRomaji(s));
  const kunyomiRomaji = kunyomiArr.map((s) => toRomaji(s));

  const merged = Array.from(new Set([...onyomiRomaji, ...kunyomiRomaji]));
  return merged.length > 0 ? merged.join(", ") : "-";
};

// Cherry Blossom Canvas Component
const CherryBlossomSnowfall = ({ isDarkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const color = isDarkMode ? "rgba(255, 102, 0, 0.5)" : "rgba(222, 49, 99, 0.5)";
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      speedY: 0.2 + Math.random() * 0.4,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.3;
        p.y += p.speedY;

        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    draw();

    const resizeHandler = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

// Main Kanji Cards Component
export default function KanjiCardsPage() {
  const [kanjiList, setKanjiList] = useState([]);
  const [filteredKanjiList, setFilteredKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [jlptLevel, setJlptLevel] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [cardLimit, setCardLimit] = useState(null);
  const [customLimit, setCustomLimit] = useState("");

  // Cache keys and duration
  const CACHE_KEY = "cachedKanjiList";
  const CACHE_TIME_KEY = "kanjiCacheTimestamp";
  const BOOKMARK_CACHE_KEY = "bookmarkedKanji";
  const BOOKMARK_SYNC_TIME_KEY = "bookmarkSyncTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

  // Initialize dark mode
  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Fetch kanji data and initialize bookmarks
  useEffect(() => {
    async function fetchKanji() {
      try {
        const response = await authFetch(`${KanjiAPI}/flagged_kanjis`);
        const data = await response.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        setKanjiList(data);
        filterAndSortKanji(data, jlptLevel, sortOrder, showBookmarkedOnly, isRandomized, cardLimit);
      } catch (err) {
        console.error("API fetch failed:", err);
      }
    }

    const cacheTime = parseInt(localStorage.getItem(CACHE_TIME_KEY), 10);
    const now = Date.now();
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (cachedData && cacheTime && now - cacheTime < CACHE_DURATION) {
      setKanjiList(cachedData);
      filterAndSortKanji(cachedData, jlptLevel, sortOrder, showBookmarkedOnly, isRandomized, cardLimit);
    } else {
      fetchKanji();
    }

    // Initialize bookmarks
    const savedBookmarks = JSON.parse(localStorage.getItem(BOOKMARK_CACHE_KEY) || "[]");
    setBookmarked(savedBookmarks);
    syncBookmarksWithDB(savedBookmarks);
  }, [jlptLevel, sortOrder, showBookmarkedOnly, isRandomized, cardLimit]);

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem(BOOKMARK_CACHE_KEY, JSON.stringify(bookmarked));
  }, [bookmarked]);

  // Filter, sort, randomize, and limit kanji
  const filterAndSortKanji = (kanjis, level, order, bookmarkedOnly, randomize, limit) => {
    let filtered = kanjis;
    
    // Filter by JLPT level if selected
    if (level) {
      filtered = kanjis.filter(kanji => kanji.jlpt_level === level);
    }
    
    // Filter by bookmarked status if enabled
    if (bookmarkedOnly) {
      const bookmarkedSet = new Set(bookmarked);
      filtered = filtered.filter(kanji => bookmarkedSet.has(kanji.kanji));
    }
    
    // Apply sorting
    let sorted = [...filtered];
    if (order === "level") {
      sorted.sort((a, b) => a.jlpt_level - b.jlpt_level);
    } else if (order === "bookmarked") {
      const bookmarkedSet = new Set(bookmarked);
      sorted.sort((a, b) => {
        const aBookmarked = bookmarkedSet.has(a.kanji) ? 1 : 0;
        const bBookmarked = bookmarkedSet.has(b.kanji) ? 1 : 0;
        return bBookmarked - aBookmarked;
      });
    }
    
    // Apply randomization
    if (randomize) {
      for (let i = sorted.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
    }
    
    // Apply card limit
    if (limit) {
      sorted = sorted.slice(0, limit);
    }
    
    setFilteredKanjiList(sorted);
    setCurrentIndex(0); // Reset to first card after filtering/sorting
  };

  // Sync bookmarks with database
  const syncBookmarksWithDB = async (bookmarks) => {
    const lastSync = parseInt(localStorage.getItem(BOOKMARK_SYNC_TIME_KEY), 10);
    const now = Date.now();
    
    // Only sync if 12 hours have passed since last sync
    if (lastSync && now - lastSync < CACHE_DURATION) return;

    try {
      const response = await authFetch(BOOKMARK_SYNC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookmarks: bookmarks,
        }),
      });

      if (response.ok) {
        localStorage.setItem(BOOKMARK_SYNC_TIME_KEY, now.toString());
      }
    } catch (err) {
      console.error("Failed to sync bookmarks:", err);
    }
  };

  // Toggle bookmark for current kanji
  const toggleBookmark = () => {
    const k = currentKanji.kanji;
    if (!k) return;
    
    const newBookmarked = bookmarked.includes(k) 
      ? bookmarked.filter((x) => x !== k) 
      : [...bookmarked, k];
    
    setBookmarked(newBookmarked);
    localStorage.setItem(BOOKMARK_CACHE_KEY, JSON.stringify(newBookmarked));
    
    // Immediately sync bookmark change with DB
    authFetch(BOOKMARK_SYNC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kanji: k,
        flag: !bookmarked.includes(k),
      }),
    }).catch(err => console.error("Failed to update bookmark:", err));

    // If showing only bookmarked and this was the last one, go to first card
    if (showBookmarkedOnly && newBookmarked.length === 0) {
      filterAndSortKanji(kanjiList, jlptLevel, sortOrder, showBookmarkedOnly, isRandomized, cardLimit);
    }
  };

  // Toggle randomization
  const toggleRandomize = () => {
    const newRandomized = !isRandomized;
    setIsRandomized(newRandomized);
    filterAndSortKanji(kanjiList, jlptLevel, sortOrder, showBookmarkedOnly, newRandomized, cardLimit);
  };

  // Set card limit
  const setLimit = (limit) => {
    setCardLimit(limit);
    filterAndSortKanji(kanjiList, jlptLevel, sortOrder, showBookmarkedOnly, isRandomized, limit);
  };

  // Set custom limit
  const handleCustomLimit = () => {
    const limit = parseInt(customLimit, 10);
    if (!isNaN(limit) && limit > 0) {
      setLimit(limit);
      setCustomLimit("");
    }
  };

  // Navigation functions
  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % filteredKanjiList.length);
    setIsFlipped(false);
  };

  const goBack = () => {
    setCurrentIndex((i) => (i - 1 + filteredKanjiList.length) % filteredKanjiList.length);
    setIsFlipped(false);
  };

  // Touch event handlers for swipe gestures
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
    const threshold = 50;
    const deltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goNext();
      } else {
        goBack();
      }
    }
  };

  // Get current kanji
  const currentKanji = filteredKanjiList[currentIndex] || {};

  // Spinner border color based on dark mode
  const spinnerBorderColor = isDarkMode
    ? "rgba(255, 102, 0, 0.8)"
    : "rgba(222, 49, 99, 0.8)";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-[#292b2d] dark:text-gray-200">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      <Link href="/Learn" className="absolute top-4 left-4 text-lg font-bold z-10">
        {`< BACK`}
      </Link>

      {/* Top Buttons */}
      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
        </button>
        <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {bookmarked.includes(currentKanji.kanji) ? <BookmarkCheck className="text-black" /> : <Bookmark className="text-black" />}
        </button>
        <button 
          onClick={toggleRandomize} 
          className={`p-2 rounded-full ${isRandomized ? 'bg-[#de3163] dark:bg-[#FF6600]' : 'bg-gray-300 dark:bg-white'}`}
        >
          <Shuffle className={`${isRandomized ? 'text-white' : 'text-black'}`} />
        </button>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          <Cog6ToothIcon className="text-black w-5 h-5" />
        </button>
      </div>

      {/* Flip Card or Loader */}
      {filteredKanjiList.length === 0 ? (
        <div className="w-full flex justify-center items-center h-[26rem] bg-white dark:bg-[#292b2d]">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin border-b-transparent"
            style={{
              borderColor: spinnerBorderColor,
              borderBottomColor: "transparent",
            }}
          />
          {showBookmarkedOnly && bookmarked.length === 0 && (
            <div className="absolute text-center">
              No bookmarked kanji found. Bookmark some kanji to see them here.
            </div>
          )}
        </div>
      ) : (
        <div
          className="relative w-full max-w-[360px] h-[26rem] my-8"
          style={{ perspective: "1000px" }}
          onClick={() => setIsFlipped(!isFlipped)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front of Card */}
            <div
              className="absolute w-full h-full flex items-center justify-center text-[10rem] rounded-2xl border-2 bg-white dark:bg-[#292b2d]"
              style={{
                backfaceVisibility: "hidden",
                borderColor: "currentColor",
                color: "inherit",
              }}
            >
              {currentKanji.kanji}
            </div>

            {/* Back of Card */}
            <div
              className="absolute w-full h-full flex flex-col justify-center items-center text-center p-4 rounded-2xl border-2 bg-white dark:bg-[#292b2d]"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="mb-2">
                <strong>Onyomi:</strong>{" "}
                {currentKanji.onyomi ? JSON.parse(currentKanji.onyomi).join(", ") : "-"}
              </div>
              <div className="mb-2">
                <strong>Kunyomi:</strong>{" "}
                {currentKanji.kunyomi ? JSON.parse(currentKanji.kunyomi).join(", ") : "-"}
              </div>
              <div className="mb-2">
                <strong>Romaji:</strong> {getRomaji(currentKanji.onyomi, currentKanji.kunyomi)}
              </div>
              <div className="mb-2">
                <strong>JLPT Level:</strong> {currentKanji.jlpt_level ? `N${currentKanji.jlpt_level}` : "-"}
              </div>
              <div>
                <strong>Meaning:</strong> {currentKanji.english || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {filteredKanjiList.length > 0 && (
        <div className="flex justify-center items-center gap-8 mt-4">
          <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
            <ArrowLeft />
          </button>
          <div className="text-xl font-bold">
            {`${currentIndex + 1} / ${filteredKanjiList.length}`}
          </div>
          <button onClick={goNext} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
            <ArrowRight />
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#292b2d] p-6 rounded-xl w-80 text-black dark:text-gray-200 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-2 right-2 text-black dark:text-white">
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Filter by JLPT Level:</label>
                <select 
                  value={jlptLevel || ''}
                  onChange={(e) => {
                    const level = e.target.value ? parseInt(e.target.value, 10) : null;
                    setJlptLevel(level);
                    filterAndSortKanji(kanjiList, level, sortOrder, showBookmarkedOnly, isRandomized, cardLimit);
                  }}
                  className="w-full p-2 border rounded dark:bg-[#292b2d]"
                >
                  <option value="">All Levels</option>
                  <option value="5">N5</option>
                  <option value="4">N4</option>
                  <option value="3">N3</option>
                  <option value="2">N2</option>
                  <option value="1">N1</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Sort By:</label>
                <select 
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    filterAndSortKanji(kanjiList, jlptLevel, e.target.value, showBookmarkedOnly, isRandomized, cardLimit);
                  }}
                  className="w-full p-2 border rounded dark:bg-[#292b2d]"
                >
                  <option value="default">Default Order</option>
                  <option value="level">By JLPT Level</option>
                  <option value="bookmarked">Bookmarked First</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bookmarkedOnly"
                  checked={showBookmarkedOnly}
                  onChange={(e) => {
                    setShowBookmarkedOnly(e.target.checked);
                    filterAndSortKanji(kanjiList, jlptLevel, sortOrder, e.target.checked, isRandomized, cardLimit);
                  }}
                  className="mr-2"
                />
                <label htmlFor="bookmarkedOnly">Show Bookmarked Only</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="randomize"
                  checked={isRandomized}
                  onChange={(e) => {
                    setIsRandomized(e.target.checked);
                    filterAndSortKanji(kanjiList, jlptLevel, sortOrder, showBookmarkedOnly, e.target.checked, cardLimit);
                  }}
                  className="mr-2"
                />
                <label htmlFor="randomize">Randomize Order</label>
              </div>
              <div>
                <label className="block mb-2">Card Limit:</label>
                <div className="flex gap-2 mb-2">
                  <button 
                    onClick={() => setLimit(5)} 
                    className={`px-3 py-1 rounded ${cardLimit === 5 ? 'bg-[#de3163] dark:bg-[#FF6600] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    5
                  </button>
                  <button 
                    onClick={() => setLimit(10)} 
                    className={`px-3 py-1 rounded ${cardLimit === 10 ? 'bg-[#de3163] dark:bg-[#FF6600] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    10
                  </button>
                  <button 
                    onClick={() => setLimit(15)} 
                    className={`px-3 py-1 rounded ${cardLimit === 15 ? 'bg-[#de3163] dark:bg-[#FF6600] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    15
                  </button>
                  <button 
                    onClick={() => setLimit(null)} 
                    className={`px-3 py-1 rounded ${cardLimit === null ? 'bg-[#de3163] dark:bg-[#FF6600] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    All
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customLimit}
                    onChange={(e) => setCustomLimit(e.target.value)}
                    placeholder="Custom number"
                    className="flex-1 p-2 border rounded dark:bg-[#292b2d]"
                    min="1"
                  />
                  <button 
                    onClick={handleCustomLimit}
                    className="px-3 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}