"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

// Dummy Kanji Data
const dummyKanjiList = [
  { kanji: "日", meaning: "Sun" },
  { kanji: "月", meaning: "Moon" },
  { kanji: "火", meaning: "Fire" },
  { kanji: "水", meaning: "Water" },
];

// Cherry Blossom Canvas Background
const CherryBlossomSnowfall = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      speedY: 0.1 + Math.random() * 0.2,
      swayAngle: Math.random() * 2 * Math.PI,
      swaySpeed: 0.002 + Math.random() * 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const color = isDark ? "rgba(255, 102, 0, 0.8)" : "rgba(222, 49, 99, 0.8)";
      particles.forEach((p) => {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.2;
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

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [isDark]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed top-0 left-0 w-full h-full z-0" />;
};

// Settings Modal Component with Dropdown
function SettingsModal({ isOpen, onClose, viewType, setViewType }) {
  if (!isOpen) return null;

  const options = ["All", "Bookmarked", "Random", "Level 1", "Level 2"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#292b2d] text-black dark:text-white p-6 rounded-xl shadow-lg min-w-[300px] relative">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        {/* Dropdown */}
        <label className="block mb-2 font-medium">View Type:</label>
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e1e] text-black dark:text-white"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 bg-[#de3163] hover:bg-pink-600 text-white px-4 py-2 rounded-md w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function KanjiCardsPage() {
  const [isDark, setIsDark] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewType, setViewType] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const cardRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(match.matches);
    const update = (e) => setIsDark(e.matches);
    match.addEventListener("change", update);
    return () => match.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const storedSound = localStorage.getItem("soundEnabled");
    if (storedSound !== null) setIsSoundOn(storedSound === "true");
  }, []);

  const toggleSound = () => {
    setIsSoundOn((prev) => {
      localStorage.setItem("soundEnabled", String(!prev));
      return !prev;
    });
  };

  const currentKanji = dummyKanjiList[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dummyKanjiList.length);
    setIsFlipped(false);
  };

  const goBack = () => {
    setCurrentIndex((prev) => (prev - 1 + dummyKanjiList.length) % dummyKanjiList.length);
    setIsFlipped(false);
  };

  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) goBack();
    else if (diff < -50) goNext();
  };

  const themeColor = isDark ? "#FF6600" : "#de3163";

  return (
    <div
      className={`min-h-screen w-screen flex items-center justify-center ${
        isDark ? "bg-[#292b2d] text-gray-200" : "bg-white text-black"
      }`}
    >
      <CherryBlossomSnowfall isDark={isDark} />

      {/* Top Left Back */}
      <div className="absolute top-4 mt-2 left-4 z-10 flex items-center gap-2">
        <Link
          href="/Learn"
          className="text-lg font-bold"
          style={{ color: isDark ? "white" : "black" }}
          aria-label="Back"
        >
          &lt; BACK
        </Link>
      </div>

      {/* Top Right Buttons */}
      <div className="absolute top-4 mt-2 right-4 z-10 flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-full"
          style={{ backgroundColor: isDark ? "white" : "#292b2d" }}
          aria-label="Toggle Sound"
        >
          {isSoundOn ? (
            <Volume2 className={`h-6 w-6 ${isDark ? "text-black" : "text-[#de3163]"}`} />
          ) : (
            <VolumeX className={`h-6 w-6 ${isDark ? "text-black" : "text-[#de3163]"}`} />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full"
          style={{ backgroundColor: isDark ? "white" : "#292b2d" }}
          aria-label="Settings"
        >
          <Cog6ToothIcon className={`h-6 w-6 ${isDark ? "text-[#000000]" : "text-[#de3163]"}`} />
        </button>
      </div>

      {/* Card Area */}
      <div className="relative z-10 w-full max-w-[400px] flex items-center justify-center px-4">
        <button
          onClick={goBack}
          className="absolute left-0 z-20 p-2 rounded-full text-white"
          style={{ backgroundColor: themeColor }}
          aria-label="Previous card"
        >
          <ArrowLeft />
        </button>

        <div
          ref={cardRef}
          onClick={() => setIsFlipped(!isFlipped)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative z-0 w-full max-w-[250px] h-[26rem] md:h-96 cursor-pointer [perspective:1000px]"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-4 rounded-xl shadow-lg bg-white dark:bg-[#292b2d] text-black dark:text-gray-200"
              style={{ border: `2px solid ${themeColor}` }}
            >
              <div className="text-[10rem] text-center">{currentKanji.kanji}</div>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full [transform:rotateY(180deg)] backface-hidden flex flex-col justify-center items-center p-4 rounded-xl shadow-lg bg-white dark:bg-[#292b2d] text-black dark:text-gray-200"
              style={{ border: `2px solid ${themeColor}` }}
            >
              <div className="text-4xl">{currentKanji.meaning}</div>
            </div>
          </div>
        </div>

        <button
          onClick={goNext}
          className="absolute right-0 z-20 p-2 rounded-full text-white"
          style={{ backgroundColor: themeColor }}
          aria-label="Next card"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Number Pill */}
      <div className="absolute bottom-28 md:bottom-24 z-10">
        <span
          className={`px-10 py-5 rounded-full text-2xl font-extrabold shadow-md ${
            isDark ? "bg-[#F66538] text-white" : "bg-[#FF5274] text-white"
          }`}
        >
          {currentIndex + 1} / {dummyKanjiList.length}
        </span>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        viewType={viewType}
        setViewType={setViewType}
      />
    </div>
  );
}
