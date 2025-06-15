"use client";

import React, { useState, useEffect, useCallback } from "react";

const BOOKMARK_CACHE_KEY = "bookmarkedKanji";

export default function SettingsModal({
  isOpen,
  onClose,
  rawKanjiList,
  onApply,
}) {
  const [jlptLevels, setJlptLevels] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [isRandomized, setIsRandomized] = useState(false);
  const [cardLimit, setCardLimit] = useState(null);
  const [customLimit, setCustomLimit] = useState("");
  const [internalBookmarked, setInternalBookmarked] = useState([]);
  const [filteredKanjiList, setFilteredKanjiList] = useState([]);

useEffect(() => {
  if (rawKanjiList.length > 0 && filteredKanjiList.length === 0) {
    // Default to showing all
    setFilteredKanjiList(rawKanjiList);
  }
}, [rawKanjiList, filteredKanjiList]);

  // Load saved settings when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedSettings = JSON.parse(localStorage.getItem("kanjiCardSettings") || "{}");

      const savedJlpt = savedSettings.jlptLevels;
      setJlptLevels(savedJlpt && savedJlpt.length ? savedJlpt : ["N5"]);

      setSortOrder(savedSettings.sortOrder || "default");
      setShowBookmarkedOnly(savedSettings.showBookmarkedOnly || false);
      setIsRandomized(savedSettings.isRandomized || false);
      setCardLimit(savedSettings.cardLimit || null);

      const bm = JSON.parse(localStorage.getItem(BOOKMARK_CACHE_KEY) || "[]");
      setInternalBookmarked(bm);
    }
  }, [isOpen]);

  const toggleJLPTLevel = useCallback((lvl) => {
    setJlptLevels(prev =>
      prev.includes(lvl) ? prev.filter(x => x !== lvl) : [...prev, lvl]
    );
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    let arr = [...rawKanjiList];

    if (jlptLevels.length) {
      const S = new Set(jlptLevels);
      arr = arr.filter(k => {
        const tags = k.tags ? k.tags.split(",").map(t => t.trim()) : [];
        return tags.some(t => S.has(t));
      });
    }

    if (showBookmarkedOnly) {
      const B = new Set(internalBookmarked);
      arr = arr.filter(k => B.has(k.kanji));
    }

    if (sortOrder === "level") {
      arr.sort((a, b) => {
        const getMin = tags => {
          const nums = tags.split(",").map(t => parseInt(t.replace("N", ""), 10));
          return isNaN(nums[0]) ? 99 : Math.min(...nums);
        };
        const levelA = a.tags ? getMin(a.tags) : 99;
        const levelB = b.tags ? getMin(b.tags) : 99;
        return levelA - levelB;
      });
    } else if (sortOrder === "bookmarked") {
      const B = new Set(internalBookmarked);
      arr.sort((a, b) => (B.has(b.kanji) ? -1 : 1) - (B.has(a.kanji) ? -1 : 1));
    }

    if (isRandomized) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    if (cardLimit && cardLimit > 0) {
      arr = arr.slice(0, cardLimit);
    }

    // Save settings
    localStorage.setItem("kanjiCardSettings", JSON.stringify({
      jlptLevels, sortOrder, showBookmarkedOnly, isRandomized, cardLimit
    }));

    onApply(arr);
  }, [rawKanjiList, jlptLevels, sortOrder, showBookmarkedOnly, isRandomized, cardLimit, internalBookmarked, onApply]);

  const handleCustomLimitChange = useCallback((e) => {
    setCustomLimit(e.target.value);
  }, []);

  const setCustomCardLimit = useCallback(() => {
    const x = parseInt(customLimit, 10);
    if (x > 0) setCardLimit(x);
    setCustomLimit("");
  }, [customLimit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white border-2 border-red-400 dark:bg-[#292b2d] p-6 rounded-xl w-80 text-black dark:text-gray-200 relative">
        <button onClick={onClose} className="absolute top-2 right-2">✕</button>
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Filter by JLPT Level:</label>
            <div className="flex flex-wrap gap-2">
              {["N5", "N4", "N3", "N2", "N1"].map(lvl => (
                <button key={lvl} onClick={() => toggleJLPTLevel(lvl)}
                  className={`px-3 py-1 rounded ${jlptLevels.includes(lvl)
                    ? 'bg-[#de3163] dark:bg-[#FF6600] text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}>
                  {lvl}
                </button>
              ))}
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
              className="mr-2" />
            <label>Show Bookmarked Only</label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" checked={isRandomized}
              onChange={e => setIsRandomized(e.target.checked)}
              className="mr-2" />
            <label>Randomize Order</label>
          </div>

          <div>
            <label className="block mb-2">Card Limit:</label>
            <div className="flex gap-2 mb-2">
              {[5, 10, 15].map(n => (
                <button key={n} onClick={() => setCardLimit(n)}
                  className={`px-3 py-1 rounded ${cardLimit === n
                    ? 'bg-[#de3163] dark:bg-[#FF6600] text-white'
                    : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setCardLimit(null)}
                className={`px-3 py-1 rounded ${cardLimit === null
                  ? 'bg-[#de3163] dark:bg-[#FF6600] text-white'
                  : 'bg-gray-200 dark:bg-gray-700'}`}>
                All
              </button>
            </div>
            <div className="flex gap-2">
              <input type="number" value={customLimit} onChange={handleCustomLimitChange}
                placeholder="Custom" className="flex-1 p-2 border rounded dark:bg-[#292b2d]" />
              <button onClick={setCustomCardLimit}
                className="px-3 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded">Set</button>
            </div>
          </div>

          {/* ✅ Apply Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={applyFiltersAndSort}
              className="px-4 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
