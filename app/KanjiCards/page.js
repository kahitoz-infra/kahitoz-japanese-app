"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import Link from "next/link";
import { authFetch } from "../middleware";

export default function KanjiCardsPage() {
  const [kanjiList, setKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const CACHE_KEY = "cachedKanjiList";
  const CACHE_TIME_KEY = "kanjiCacheTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000;

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mql.matches);
    const listener = (e) => setIsDark(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    async function fetchKanji() {
      try {
        const response = await authFetch("https://apizenkanji.kahitoz.com/v1/flagged_kanjis");
        const data = await response.json();
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        setKanjiList(data);
      } catch (err) {
        console.error("API fetch failed:", err);
      }
    }

    const cacheTime = parseInt(localStorage.getItem(CACHE_TIME_KEY), 10);
    const now = Date.now();
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (cachedData && cacheTime && now - cacheTime < CACHE_DURATION) {
      setKanjiList(cachedData);
    } else {
      fetchKanji();
    }
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedKanji") || "[]");
    setBookmarked(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedKanji", JSON.stringify(bookmarked));
  }, [bookmarked]);

  const currentKanji = kanjiList[currentIndex] || {};
  const themeColor = isDark ? "#FF6600" : "#de3163";

  const toggleBookmark = () => {
    const k = currentKanji.kanji;
    if (!k) return;
    setBookmarked((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % kanjiList.length);
    setIsFlipped(false);
  };

  const goBack = () => {
    setCurrentIndex((i) => (i - 1 + kanjiList.length) % kanjiList.length);
    setIsFlipped(false);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? "bg-[#292b2d] text-gray-200" : "bg-white text-black"}`}>
      <Link href="/Learn" className="absolute top-4 left-4 text-lg font-bold">{`< BACK`}</Link>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
        </button>
        <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {bookmarked.includes(currentKanji.kanji) ? <BookmarkCheck className="text-black" /> : <Bookmark className="text-black" />}
        </button>
      </div>

      {/* Flip Card */}
      <div
        className="relative w-full max-w-[250px] h-[26rem] my-8"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-[10rem] rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              borderColor: themeColor,
              backgroundColor: isDark ? "#292b2d" : "white",
            }}
          >
            {currentKanji.kanji || "?"}
          </div>

          {/* BACK */}
          <div
            className="absolute w-full h-full flex flex-col justify-center items-center text-center p-4 rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: themeColor,
              backgroundColor: isDark ? "#292b2d" : "white",
            }}
          >
            <div className="mb-2"><strong>Onyomi:</strong> {currentKanji.onyomi ? JSON.parse(currentKanji.onyomi).join(", ") : "-"}</div>
            <div className="mb-2"><strong>Kunyomi:</strong> {currentKanji.kunyomi ? JSON.parse(currentKanji.kunyomi).join(", ") : "-"}</div>
            <div><strong>Meaning:</strong> {currentKanji.english || "-"}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button onClick={goBack} className="bg-[#de3163] text-white p-3 rounded-full"><ArrowLeft /></button>
        <div className="text-xl font-bold">{kanjiList.length ? `${currentIndex + 1} / ${kanjiList.length}` : "Loading..."}</div>
        <button onClick={goNext} className="bg-[#de3163] text-white p-3 rounded-full"><ArrowRight /></button>
      </div>
    </div>
  );
}
