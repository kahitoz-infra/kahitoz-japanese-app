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

const KanjiAPI = process.env.NEXT_PUBLIC_API_URL + "/flagged_kanjis";
const BOOKMARK_SYNC_API = "https://apizenkanji.kahitoz.com/v1/update_flag";
const CACHE_KEY = "cachedKanjiList";
const CACHE_TIME_KEY = "kanjiCacheTimestamp";
const BOOKMARK_CACHE_KEY = "bookmarkedKanji";
const BOOKMARK_SYNC_TIME_KEY = "bookmarkSyncTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 h

function getRomaji(onyomi, kunyomi) {
  const ony = onyomi ? JSON.parse(onyomi) : [];
  const kuny = kunyomi ? JSON.parse(kunyomi) : [];
  const romajiList = Array.from(new Set([...ony, ...kuny].map(s => toRomaji(s))));
  return romajiList.length ? romajiList.join(", ") : "-";
}

function CherryBlossomSnowfall({ isDarkMode }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = window.innerWidth,
        h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const color = isDarkMode ? "rgba(255,102,0,0.5)" : "rgba(222,49,99,0.5)";
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.6 + 0.6,
      speedY: 0.2 + Math.random() * 0.4,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.3;
        p.y += p.speedY;
        if (p.y > h) {
          p.y = 0;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w; canvas.height = h;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function KanjiCardsPage() {
  const [kanjiList, setKanjiList] = useState([]);
  const [filteredKanjiList, setFilteredKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [jlptLevels, setJlptLevels] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [cardLimit, setCardLimit] = useState(null);
  const [customLimit, setCustomLimit] = useState("");

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    const load = async () => {
      const now = Date.now();
      const cacheTime = parseInt(localStorage.getItem(CACHE_TIME_KEY) || "0", 10);
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved && now - cacheTime < CACHE_DURATION) {
        setKanjiList(JSON.parse(saved));
      } else {
        try {
          const res = await authFetch(KanjiAPI);
          const data = await res.json();
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
          setKanjiList(data);
        } catch (e) {
          console.error("API error:", e);
        }
      }
      const bm = JSON.parse(localStorage.getItem(BOOKMARK_CACHE_KEY) || "[]");
      setBookmarked(bm);
      const lastSync = parseInt(localStorage.getItem(BOOKMARK_SYNC_TIME_KEY) || "0", 10);
      if (now - lastSync > CACHE_DURATION) {
        authFetch(BOOKMARK_SYNC_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookmarks: bm }),
        })
          .then(() => localStorage.setItem(BOOKMARK_SYNC_TIME_KEY, now.toString()))
          .catch(console.error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    filterAndSortKanji();
  }, [kanjiList, jlptLevels, sortOrder, showBookmarkedOnly, isRandomized, cardLimit, bookmarked]);

  function filterAndSortKanji() {
    let arr = [...kanjiList];
    if (jlptLevels.length) {
      const S = new Set(jlptLevels);
      arr = arr.filter(k => {
        const tags = k.tags ? k.tags.split(",").map(t => t.trim()) : [];
        return tags.some(t => S.has(t));
      });
    }
    if (showBookmarkedOnly) {
      const B = new Set(bookmarked);
      arr = arr.filter(k => B.has(k.kanji));
    }
    if (sortOrder === "level") {
      arr.sort((a, b) => {
        const getMin = tags => {
          const nums = tags.split(",").map(t => parseInt(t.replace("N", ""), 10));
          return isNaN(nums[0]) ? 99 : Math.min(...nums);
        };
        return getMin(a.tags) - getMin(b.tags);
      });
    }
    if (sortOrder === "bookmarked") {
      const B = new Set(bookmarked);
      arr.sort((a, b) => (B.has(b.kanji) ? 1 : 0) - (B.has(a.kanji) ? 1 : 0));
    }
    if (isRandomized) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    if (cardLimit) arr = arr.slice(0, cardLimit);
    setFilteredKanjiList(arr);
    setCurrentIndex(0);
  }

  function toggleBookmark() {
    const k = filteredKanjiList[currentIndex]?.kanji;
    if (!k) return;
    const newB = bookmarked.includes(k) ? bookmarked.filter(x => x !== k) : [...bookmarked, k];
    setBookmarked(newB);
    localStorage.setItem(BOOKMARK_CACHE_KEY, JSON.stringify(newB));
    authFetch(BOOKMARK_SYNC_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanji: k, flag: !bookmarked.includes(k) }),
    }).catch(console.error);
  }

  function toggleJLPTLevel(lvl) {
    const newL = jlptLevels.includes(lvl) ? jlptLevels.filter(x => x !== lvl) : [...jlptLevels, lvl];
    setJlptLevels(newL);
  }

  function goNext() {
    setCurrentIndex(i => (i + 1) % filteredKanjiList.length);
    setIsFlipped(false);
  }
  function goBack() {
    setCurrentIndex(i => (i - 1 + filteredKanjiList.length) % filteredKanjiList.length);
    setIsFlipped(false);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.changedTouches[0].screenX;
  }
  function handleTouchEnd(e) {
    touchEndX.current = e.changedTouches[0].screenX;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goBack();
    }
  }

  const currentKanji = filteredKanjiList[currentIndex] || {};
  const spinnerColor = isDarkMode ? "rgba(255,102,0,0.8)" : "rgba(222,49,99,0.8)";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-[#292b2d] dark:text-gray-200">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />
      <Link href="/Learn" className="absolute top-4 left-4 text-lg font-bold z-10">{"< BACK"}</Link>

      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <button onClick={() => setIsSoundOn(s => !s)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
        </button>
        <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          {bookmarked.includes(currentKanji.kanji) ? <BookmarkCheck className="text-black" /> : <Bookmark className="text-black" />}
        </button>
        <button onClick={() => setIsRandomized(r => !r)} className={`p-2 rounded-full ${isRandomized ? 'bg-[#de3163] dark:bg-[#FF6600]':'bg-gray-300 dark:bg-white'}`}>
          <Shuffle className={isRandomized ? 'text-white' : 'text-black'} />
        </button>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
          <Cog6ToothIcon className="text-black w-5 h-5" />
        </button>
      </div>

      {filteredKanjiList.length === 0 ? (
        <div className="w-full flex justify-center items-center h-[26rem] bg-white dark:bg-[#292b2d]">
          <div className="w-12 h-12 border-4 rounded-full animate-spin border-b-transparent" style={{ borderColor: spinnerColor }} />
          {showBookmarkedOnly && bookmarked.length === 0 && <div className="absolute text-center">No bookmarked kanji found.</div>}
        </div>
      ) : (
        <div className="relative w-full max-w-[360px] h-[26rem] my-8" style={{ perspective: "1000px" }}
             onClick={() => setIsFlipped(f => !f)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            <div className="absolute w-full h-full flex items-center justify-center text-[10rem] rounded-2xl border-2 bg-white dark:bg-[#292b2d]" style={{ backfaceVisibility: "hidden" }}>
              {currentKanji.kanji}
            </div>
            <div className="absolute w-full h-full flex flex-col justify-center items-center text-center p-4 rounded-2xl border-2 bg-white dark:bg-[#292b2d]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <div className="mb-2"><strong>Onyomi:</strong> {currentKanji.onyomi ? JSON.parse(currentKanji.onyomi).join(", ") : "-"}</div>
              <div className="mb-2"><strong>Kunyomi:</strong> {currentKanji.kunyomi ? JSON.parse(currentKanji.kunyomi).join(", ") : "-"}</div>
              <div className="mb-2"><strong>Romaji:</strong> {getRomaji(currentKanji.onyomi, currentKanji.kunyomi)}</div>
              <div className="mb-2"><strong>JLPT:</strong> {currentKanji.tags ? currentKanji.tags.split(",")[0] : "-"}</div>
              <div><strong>Meaning:</strong> {currentKanji.english || "-"}</div>
            </div>
          </div>
        </div>
      )}

      {filteredKanjiList.length > 0 && (
        <div className="flex justify-center items-center gap-8 mt-4">
          <button onClick={goBack} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full"><ArrowLeft /></button>
          <div className="text-xl font-bold">{`${currentIndex + 1} / ${filteredKanjiList.length}`}</div>
          <button onClick={goNext} className="bg-[#de3163] dark:bg-[#FF6600] text-white p-3 rounded-full"><ArrowRight /></button>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#292b2d] p-6 rounded-xl w-80 text-black dark:text-gray-200 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-2 right-2">✕</button>
            <h2 className="text-lg font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Filter by JLPT Level:</label>
                <div className="flex flex-wrap gap-2">
                  {["N5","N4","N3","N2","N1"].map(lvl => (
                    <button key={lvl} onClick={() => toggleJLPTLevel(lvl)}
                            className={`px-3 py-1 rounded ${jlptLevels.includes(lvl)?'bg-[#de3163] dark:bg-[#FF6600] text-white':'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}>
                      {lvl}
                    </button>))}
                </div>
              </div>

              <div>
                <label className="block mb-2">Sort By:</label>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                        className="w-full p-2 border rounded dark:bg-[#292b2d]">
                  <option value="default">Default</option>
                  <option value="level">By Level</option>
                  <option value="bookmarked">Bookmarked First</option>
                </select>
              </div>

              <div className="flex items-center">
                <input type="checkbox" checked={showBookmarkedOnly}
                       onChange={e => setShowBookmarkedOnly(e.target.checked)}
                       className="mr-2"/>
                <label>Show Bookmarked Only</label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" checked={isRandomized}
                       onChange={e => setIsRandomized(e.target.checked)}
                       className="mr-2"/>
                <label>Randomize Order</label>
              </div>

              <div>
                <label className="block mb-2">Card Limit:</label>
                <div className="flex gap-2 mb-2">
                  {[5,10,15].map(n => (
                    <button key={n} onClick={() => setCardLimit(n)}
                            className={`px-3 py-1 rounded ${cardLimit===n?'bg-[#de3163] dark:bg-[#FF6600] text-white':'bg-gray-200 dark:bg-gray-700'}`}>
                      {n}
                    </button>))}
                  <button onClick={() => setCardLimit(null)}
                          className={`px-3 py-1 rounded ${cardLimit===null?'bg-[#de3163] dark:bg-[#FF6600] text-white':'bg-gray-200 dark:bg-gray-700'}`}>
                    All
                  </button>
                </div>
                <div className="flex gap-2">
                  <input type="number" value={customLimit} onChange={e => setCustomLimit(e.target.value)}
                         placeholder="Custom" className="flex-1 p-2 border rounded dark:bg-[#292b2d]"/>
                  <button onClick={() => {
                    const x = parseInt(customLimit, 10);
                    if (x > 0) setCardLimit(x);
                    setCustomLimit("");
                  }} className="px-3 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded">Set</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
