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

const VocabAPI = process.env.NEXT_PUBLIC_API_URL;
const BOOKMARK_SYNC_API = "https://apizenkanji.kahitoz.com/v1/update_vocab_flag";
const CACHE_KEY = "cachedVocabList";
const CACHE_TIME_KEY = "vocabCacheTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000;
const BOOKMARK_SYNC_INTERVAL = CACHE_DURATION;

export default function VocabularyCardsPage() {
  const [vocabList, setVocabList] = useState([]);
  const [filteredVocabList, setFilteredVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const [jlptFilters, setJlptFilters] = useState(["N5", "N4", "N3", "N2", "N1"]);
  const [sortBy, setSortBy] = useState("Default");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [randomizeLimit, setRandomizeLimit] = useState(null);
  const [customLimit, setCustomLimit] = useState("");
  const [isRandomized, setIsRandomized] = useState(false);

  const syncTimeoutRef = useRef(null);
  const touchStartX = useRef(0);

 async function syncBookmarksWithAPI(wordIdArray, actionType) {
  try {
    for (const t_id of wordIdArray) {
      const res = await authFetch(BOOKMARK_SYNC_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation_type: actionType === "add", // true for add/bookmark, false for remove/unbookmark
          t_id,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
    }

    localStorage.setItem("lastBookmarkSync", Date.now().toString());
  } catch (e) {
    console.error("Bookmark sync failed:", e);
    syncTimeoutRef.current = setTimeout(
      () => syncBookmarksWithAPI(wordIdArray, actionType),
      5 * 60 * 1000
    );
  }
}


const toggleBookmark = () => {
  const word = currentVocab.word;
  const id = currentVocab.index;
  if (!word || id == null) return;

  const isBookmarked = bookmarked.includes(id);

  const updatedList = isBookmarked
    ? bookmarked.filter(x => x !== id)
    : [...bookmarked, id];

  setBookmarked(updatedList);
  localStorage.setItem("bookmarkedVocab", JSON.stringify(updatedList));

  syncBookmarksWithAPI([id], isBookmarked ? "remove" : "add");
};


  const checkAndSyncBookmarks = savedList => {
    const lastSync = +localStorage.getItem("lastBookmarkSync") || 0;
    if (Date.now() - lastSync > BOOKMARK_SYNC_INTERVAL && savedList.length) {
      syncBookmarksWithAPI(savedList, "add");
    }
  };

  const toggleRandomize = () => setIsRandomized(v => !v);

  const applyCustomLimit = () => {
    const x = parseInt(customLimit, 10);
    if (!isNaN(x) && x > 0) {
      setRandomizeLimit(x);
    }
    setCustomLimit("");
  };

  const handleJlptCheckbox = level =>
    setJlptFilters(fs =>
      fs.includes(level) ? fs.filter(x => x !== level) : [...fs, level]
    );

  const handleTouchStart = e => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = e => {
    const delta = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(delta) > 50) (delta > 0 ? goNext : goBack)();
  };

  const goNext = () => {
    setCurrentIndex(i => (i + 1) % filteredVocabList.length);
    setIsFlipped(false);
  };

  const goBack = () => {
    setCurrentIndex(i => (i - 1 + filteredVocabList.length) % filteredVocabList.length);
    setIsFlipped(false);
  };

  useEffect(() => {
    let arr = [...vocabList];

    if (showBookmarkedOnly) {
      const setB = new Set(bookmarked);
      arr = arr.filter(v => setB.has(v.word));
    }

    if (jlptFilters.length) {
      arr = arr.filter(v => jlptFilters.includes(v.level));
    }

    if (sortBy === "By Level") {
      const order = { N5: 5, N4: 4, N3: 3, N2: 2, N1: 1 };
      arr.sort((a, b) => (order[b.level] || 0) - (order[a.level] || 0));
    } else if (sortBy === "Bookmarked First") {
      const setB = new Set(bookmarked);
      arr.sort((a, b) => (setB.has(b.word) ? 1 : 0) - (setB.has(a.word) ? 1 : 0));
    }

    if (isRandomized && randomizeLimit) {
      const firstPart = arr.slice(0, randomizeLimit);
      const rest = arr.slice(randomizeLimit);
      for (let i = firstPart.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [firstPart[i], firstPart[j]] = [firstPart[j], firstPart[i]];
      }
      arr = [...firstPart, ...rest];
    }

    setFilteredVocabList(arr);
    setCurrentIndex(0);
  }, [
    vocabList,
    bookmarked,
    showBookmarkedOnly,
    jlptFilters,
    sortBy,
    isRandomized,
    randomizeLimit,
  ]);

  const currentVocab = filteredVocabList[currentIndex] || {};
  const themeColor = isDark ? "#FF6600" : "#de3163";

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mql.matches);
    const listener = e => setIsDark(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const resp = await authFetch(`${VocabAPI}/flagged_vocab`);
        const data = await resp.json();
        const enriched = data.map(item => ({
          word: item.word,
          level: item.level,
          meaning: item.meaning,
          furigana: item.furigana,
        }));
        localStorage.setItem(CACHE_KEY, JSON.stringify(enriched));
        localStorage.setItem(CACHE_TIME_KEY, `${Date.now()}`);
        setVocabList(enriched);
      } catch (e) {
        console.error("Fetch vocab failed:", e);
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
        setVocabList(cached);
      }
      setLoading(false);
    }

    const ct = +localStorage.getItem(CACHE_TIME_KEY) || 0;
    if (Date.now() - ct < CACHE_DURATION) {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
      setVocabList(cached);
      setLoading(false);
    } else {
      load();
    }
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedVocab") || "[]");
    setBookmarked(saved);
    checkAndSyncBookmarks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedVocab", JSON.stringify(bookmarked));
    if (bookmarked.length) {
      syncBookmarksWithAPI(bookmarked, "add");
    }
  }, [bookmarked]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? "bg-[#292b2d]" : "bg-white"
        }`}
      >
        <div
          className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
          style={{
            borderColor: isDark
              ? "#FF6600 transparent #FF6600 transparent"
              : "#de3163 transparent #de3163 transparent",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isDark ? "bg-[#292b2d] text-gray-200" : "bg-white text-black"
      }`}
    >
      <canvas /* Cherry blossoms in the background */ />
      <Link href="/Learn" className="absolute top-4 left-4 text-lg font-bold">
        &lt; BACK
      </Link>
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() => setIsSoundOn(v => !v)}
          className="p-2 rounded-full bg-gray-300 dark:bg-white"
        >
          {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
        </button>
        <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {bookmarked.includes(currentVocab.index) ? (
            <BookmarkCheck className="text-black" />
          ) : (
            <Bookmark className="text-black" />
          )}
        </button>
        <button
          onClick={toggleRandomize}
          className={`p-2 rounded-full ${
            isRandomized ? "bg-[#de3163] dark:bg-[#FF6600]" : "bg-gray-300 dark:bg-white"
          }`}
        >
          <Shuffle className={isRandomized ? "text-white" : "text-black"} />
        </button>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          <Cog6ToothIcon className="text-black w-5 h-5" />
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#292b2d] p-6 rounded-xl w-80 dark:text-gray-200 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-2 right-2 text-black dark:text-white">
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Settings</h2>

            <div className="space-y-4">
              <div>
                <span className="block font-medium">Filter by JLPT:</span>
                {["N5", "N4", "N3", "N2", "N1"].map(lvl => (
                  <label key={lvl} className="inline-flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={jlptFilters.includes(lvl)}
                      onChange={() => handleJlptCheckbox(lvl)}
                      className="mr-1"
                    />
                    {lvl}
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium">Sort by</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-[#1f1f1f] dark:border-gray-600"
                >
                  <option>Default</option>
                  <option>By Level</option>
                  <option>Bookmarked First</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={showBookmarkedOnly}
                  onChange={() => setShowBookmarkedOnly(v => !v)}
                  className="mr-2"
                />
                <label>Show Bookmarked Only</label>
              </div>
              <div>
                <span className="block font-medium">Randomize First N</span>
                {[5, 10, 15].map(n => (
                  <button
                    key={n}
                    onClick={() => setRandomizeLimit(n)}
                    className={`mr-2 px-2 py-1 rounded ${
                      randomizeLimit === n ? "bg-[#de3163] text-white" : "bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <div className="mt-2 flex">
                  <input
                    type="number"
                    value={customLimit}
                    onChange={e => setCustomLimit(e.target.value)}
                    placeholder="Custom"
                    className="w-20 p-1 border rounded dark:bg-[#292b2d]"
                  />
                  <button onClick={applyCustomLimit} className="ml-2 px-2 py-1 bg-[#de3163] text-white rounded">
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


     
      <div
        className="relative w-full max-w-xs h-96 my-8"
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
          {/* Front side */}
          <div
            className="absolute w-full h-full flex flex-col justify-center items-center rounded-2xl border-2 px-4"
            style={{
              backfaceVisibility: "hidden",
              borderColor: themeColor,
              backgroundColor: isDark ? "#292b2d" : "white",
            }}
          >
            <div className="text-7xl font-bold">{currentVocab.word || "?"}</div>
            <div className="text-xl mt-2">{currentVocab.furigana || ""}</div>
          </div>

          {/* Back side */}
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
              <div>
                <strong>Meaning:</strong> {currentVocab.meaning || "-"}
              </div>
              <div>
                <strong>Level:</strong> {currentVocab.level || "-"}
              </div>
            </div>
          </div>
          
        </div>
      </div>


      {/* Navigation / Controls */}
      <div className="flex items-center gap-8 mt-4">
        <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
          <ArrowLeft />
        </button>
        <div className="text-xl font-bold">
          {filteredVocabList.length ? `${currentIndex + 1} / ${filteredVocabList.length}` : "No cards"}
        </div>
        <button onClick={goNext} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
