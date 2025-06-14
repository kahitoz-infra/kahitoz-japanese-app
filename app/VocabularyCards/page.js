"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { authFetch } from "../middleware";
import { toHiragana } from "wanakana";

const VocabAPI = process.env.NEXT_PUBLIC_API_URL;
const BOOKMARK_SYNC_API = "https://apizenkanji.kahitoz.com/v1/update_vocab_flag";
const BOOKMARK_SYNC_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
const CACHE_KEY = "cachedVocabList";
const CACHE_TIME_KEY = "vocabCacheTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000;

const CherryBlossomSnowfall = () => {
  // ... (CherryBlossomSnowfall component remains exactly the same)
};

export default function VocabularyCardsPage() {
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shuffle, setShuffle] = useState("Off");
  const [filter, setFilter] = useState("Show All");
  const [randomOrder, setRandomOrder] = useState("Off");
  const [jlptLevel, setJlptLevel] = useState("All");
  const [sortBy, setSortBy] = useState("Default");
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const syncTimeoutRef = useRef(null);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Calculate filtered list first
  const filteredList = vocabList
    .filter((v) => {
      if (filter === "Only Bookmarked") return bookmarked.includes(v.word);
      return true;
    })
    .filter((v) => {
      if (jlptLevel === "All") return true;
      return v.jlpt_level === parseInt(jlptLevel);
    })
    .sort((a, b) => {
      if (sortBy === "Default") return 0;
      if (sortBy === "JLPT Level") return (a.jlpt_level || 0) - (b.jlpt_level || 0);
      if (sortBy === "Alphabetical") return a.word.localeCompare(b.word);
      if (sortBy === "Bookmarked First") {
        const aBookmarked = bookmarked.includes(a.word);
        const bBookmarked = bookmarked.includes(b.word);
        return aBookmarked === bBookmarked ? 0 : aBookmarked ? -1 : 1;
      }
      return 0;
    });

  const currentVocab = filteredList[currentIndex] || {};
  const themeColor = isDark ? "#FF6600" : "#de3163";

  // All useEffect hooks
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mql.matches);
    const listener = (e) => setIsDark(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    async function fetchVocab() {
      try {
        const response = await authFetch(`${VocabAPI}/flagged_vocab`);
        const data = await response.json();
        const enrichedData = data.map((item) => ({
          ...item,
          hiragana: toHiragana(item.word),
        }));
        localStorage.setItem(CACHE_KEY, JSON.stringify(enrichedData));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        setVocabList(enrichedData);
        setLoading(false);
      } catch (err) {
        console.error("API fetch failed:", err);
        setLoading(false);
      }
    }

    const cacheTime = parseInt(localStorage.getItem(CACHE_TIME_KEY), 10);
    const now = Date.now();
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (cachedData && cacheTime && now - cacheTime < CACHE_DURATION) {
      setVocabList(cachedData);
      setLoading(false);
    } else {
      fetchVocab();
    }
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedVocab") || "[]");
    setBookmarked(saved);
    checkAndSyncBookmarks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedVocab", JSON.stringify(bookmarked));
    
    if (bookmarked.length > 0 || lastSyncTime > 0) {
      syncBookmarksWithAPI();
    }
  }, [bookmarked]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filter, jlptLevel, sortBy]);

  useEffect(() => {
    if (shuffle === "On" || randomOrder === "On") {
      const shuffled = [...vocabList].sort(() => 0.5 - Math.random());
      setVocabList(shuffled);
    }
  }, [shuffle, randomOrder]);

  // Helper functions
  const checkAndSyncBookmarks = (localBookmarks) => {
    const lastSync = parseInt(localStorage.getItem("lastBookmarkSync") || "0", 10);
    setLastSyncTime(lastSync);
    const now = Date.now();
    
    if (now - lastSync > BOOKMARK_SYNC_INTERVAL) {
      syncBookmarksWithAPI(localBookmarks);
    }
  };

  const syncBookmarksWithAPI = async (bookmarksToSync = null) => {
    const bookmarks = bookmarksToSync || bookmarked;
    
    if (bookmarks.length === 0) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    try {
      const response = await authFetch(BOOKMARK_SYNC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          words: bookmarks,
        }),
      });

      if (response.ok) {
        const now = Date.now();
        localStorage.setItem("lastBookmarkSync", now.toString());
        setLastSyncTime(now);
      } else {
        syncTimeoutRef.current = setTimeout(() => {
          syncBookmarksWithAPI(bookmarks);
        }, 5 * 60 * 1000);
      }
    } catch (error) {
      console.error("Bookmark sync failed:", error);
      syncTimeoutRef.current = setTimeout(() => {
        syncBookmarksWithAPI(bookmarks);
      }, 5 * 60 * 1000);
    }
  };

  const toggleBookmark = async () => {
    const v = currentVocab.word;
    if (!v) return;
    
    const newBookmarks = bookmarked.includes(v)
      ? bookmarked.filter((x) => x !== v)
      : [...bookmarked, v];
    
    setBookmarked(newBookmarks);

    try {
      const response = await authFetch(BOOKMARK_SYNC_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          words: [v],
          action: bookmarked.includes(v) ? "remove" : "add",
        }),
      });

      if (response.ok) {
        const now = Date.now();
        localStorage.setItem("lastBookmarkSync", now.toString());
        setLastSyncTime(now);
      }
    } catch (error) {
      console.error("Immediate bookmark update failed:", error);
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) goNext();
      else goBack();
    }
  };

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % filteredList.length);
    setIsFlipped(false);
  };

  const goBack = () => {
    setCurrentIndex((i) => (i - 1 + filteredList.length) % filteredList.length);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? "bg-[#292b2d]" : "bg-white"}`}>
        <div
          className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
          style={{
            borderColor: isDark
              ? "#FF6600 transparent #FF6600 transparent"
              : "#de3163 transparent #de3163 transparent",
          }}
        ></div>
      </div>
    );
  }

  // JSX return
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? "bg-[#292b2d] text-gray-200" : "bg-white text-black"}`}>
      <CherryBlossomSnowfall />
      <Link href="/Learn" className="absolute top-4 left-4 text-lg font-bold">{`< BACK`}</Link>

      <div className="absolute top-4 right-4 flex gap-3">
        <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
        </button>
        <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {bookmarked.includes(currentVocab.word) ? <BookmarkCheck className="text-black" /> : <Bookmark className="text-black" />}
        </button>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          <Cog6ToothIcon className="text-black w-5 h-5" />
        </button>
      </div>

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
          <div
            className="absolute w-full h-full flex flex-col justify-center items-center rounded-2xl border-2 px-4"
            style={{
              backfaceVisibility: "hidden",
              borderColor: themeColor,
              backgroundColor: isDark ? "#292b2d" : "white",
            }}
          >
            <div className="text-7xl font-bold">{currentVocab.word || "?"}</div>
            <div className="text-xl mt-2">{currentVocab.hiragana || ""}</div>
          </div>

          <div
            className="absolute w-full h-full flex justify-center items-center text-center p-4 rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: themeColor,
              backgroundColor: isDark ? "#292b2d" : "white",
            }}
          >
            <div className="text-2xl space-y-2">
              <div><strong>Meaning:</strong> {currentVocab.meaning || "-"}</div>
              {currentVocab.other_readings?.length > 0 && (
                <div><strong>Other Readings:</strong> {currentVocab.other_readings.join(", ")}</div>
              )}
              {currentVocab.jlpt_level && (
                <div><strong>JLPT Level:</strong> N{currentVocab.jlpt_level}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 mt-4">
        <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full"><ArrowLeft /></button>
        <div className="text-xl font-bold">{filteredList.length ? `${currentIndex + 1} / ${filteredList.length}` : "No cards"}</div>
        <button onClick={goNext} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full"><ArrowRight /></button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#292b2d] p-6 rounded-xl w-80 text-black dark:text-gray-200 relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-2 right-2 text-black dark:text-white"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Shuffle Cards</label>
                <select
                  value={shuffle}
                  onChange={(e) => setShuffle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1f1f1f] dark:border-gray-600"
                >
                  <option>Off</option>
                  <option>On</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Bookmark Filter</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1f1f1f] dark:border-gray-600"
                >
                  <option>Show All</option>
                  <option>Only Bookmarked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">JLPT Level</label>
                <select
                  value={jlptLevel}
                  onChange={(e) => setJlptLevel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1f1f1f] dark:border-gray-600"
                >
                  <option>All</option>
                  <option>5</option>
                  <option>4</option>
                  <option>3</option>
                  <option>2</option>
                  <option>1</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1f1f1f] dark:border-gray-600"
                >
                  <option>Default</option>
                  <option>JLPT Level</option>
                  <option>Alphabetical</option>
                  <option>Bookmarked First</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Random Order</label>
                <select
                  value={randomOrder}
                  onChange={(e) => setRandomOrder(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1f1f1f] dark:border-gray-600"
                >
                  <option>Off</option>
                  <option>On</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}