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

const KanjiAPI = process.env.NEXT_PUBLIC_API_URL;

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

// Main Component
export default function KanjiCardsPage() {
  const [kanjiList, setKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const CACHE_KEY = "cachedKanjiList";
  const CACHE_TIME_KEY = "kanjiCacheTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000;

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => {
    async function fetchKanji() {
      try {
        const response = await authFetch(`${KanjiAPI}/flagged_kanjis`);
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
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          <Cog6ToothIcon className="text-black w-5 h-5" />
        </button>
      </div>

      {/* Flip Card or Loader */}
      {kanjiList.length === 0 ? (
        <div className="w-full flex justify-center items-center h-[26rem] bg-white dark:bg-[#292b2d]">
          <div className="relative w-12 h-12">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                borderWidth: "4px",
                borderStyle: "solid",
                borderColor: spinnerBorderColor,
                borderTopColor: "transparent",
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className="relative w-full max-w-[360px] h-[26rem] my-8"
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
            {/* Front */}
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

            {/* Back */}
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
              <div>
                <strong>Meaning:</strong> {currentKanji.english || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {kanjiList.length > 0 && (
        <div className="flex justify-center items-center gap-8 mt-4">
          <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full">
            <ArrowLeft />
          </button>
          <div className="text-xl font-bold">
            {`${currentIndex + 1} / ${kanjiList.length}`}
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
            <div className="space-y-2">
              <p>Option 1: View Mode</p>
              <p>Option 2: Shuffle</p>
              {/* Add dropdowns or toggles as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
