"use client";

import React, { useState, useEffect, useCallback } from "react";

const BOOKMARK_CACHE_KEY = "bookmarkedVocab";
const SETTINGS_CACHE_KEY = "vocabCardSettings"; // New constant for settings key

export default function SettingsModal({
  isOpen,
  onClose,
  rawVocabList,
  onApply,
}) {
  // Initialize state with values from localStorage, or sensible defaults
  const [jlptLevels, setJlptLevels] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || "{}");
      const savedJlpt = savedSettings.jlptLevels;
      return savedJlpt && savedJlpt.length ? savedJlpt : ["N5"];
    }
    return ["N5"]; // Default for server-side rendering
  });

  const [sortOrder, setSortOrder] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || "{}");
      return savedSettings.sortOrder || "default";
    }
    return "default";
  });

  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || "{}");
      return savedSettings.showBookmarkedOnly || false;
    }
    return false;
  });

  const [isRandomized, setIsRandomized] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || "{}");
      return savedSettings.isRandomized || false;
    }
    return false;
  });

  const [cardLimit, setCardLimit] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || "{}");
      return savedSettings.cardLimit || null;
    }
    return null;
  });

  const [customLimit, setCustomLimit] = useState("");
  const [internalBookmarked, setInternalBookmarked] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(BOOKMARK_CACHE_KEY) || "[]");
    }
    return [];
  });
  const [filteredVocabList, setFilteredVocabList] = useState([]);

  // Effect to set initial filteredVocabList if rawVocabList is available
  useEffect(() => {
    if (rawVocabList.length > 0 && filteredVocabList.length === 0) {
      // Default to showing all
      setFilteredVocabList(rawVocabList);
    }
  }, [rawVocabList, filteredVocabList]);

  // Effects to save state items to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify({
        jlptLevels,
        sortOrder,
        showBookmarkedOnly,
        isRandomized,
        cardLimit,
      }));
    }
  }, [jlptLevels, sortOrder, showBookmarkedOnly, isRandomized, cardLimit]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(BOOKMARK_CACHE_KEY, JSON.stringify(internalBookmarked));
    }
  }, [internalBookmarked]);

  const toggleJLPTLevel = useCallback((lvl) => {
    setJlptLevels(prev =>
      prev.includes(lvl) ? prev.filter(x => x !== lvl) : [...prev, lvl]
    );
  }, []);

  const applyFiltersAndSort = useCallback(() => {
    // Ensure rawVocabList is used, or a cached version if applicable
    const localRaw = rawVocabList.length > 0 ? rawVocabList : JSON.parse(localStorage.getItem("cachedVocabList") || "[]");
    let arr = [...localRaw];

    // JLPT level filtering
    if (jlptLevels.length) {
      const S = new Set(jlptLevels);
      arr = arr.filter(k => {
        const levels = k.level ? k.level.split(",").map(t => t.trim()) : [];
        return levels.some(t => S.has(t));
      });
    }

    // Bookmarked only
    if (showBookmarkedOnly) {
      arr = arr.filter(k => k.marked === true);
    }

    // Sorting
    if (sortOrder === "level") {
      const getMin = level => {
        const nums = level.split(",").map(t => parseInt(t.replace("N", ""), 10));
        return isNaN(nums[0]) ? 99 : Math.min(...nums);
      };
      arr.sort((a, b) => {
        const levelA = a.level ? getMin(a.level) : 99;
        const levelB = b.level ? getMin(b.level) : 99;
        return levelA - levelB;
      });
    } else if (sortOrder === "bookmarked") {
      arr.sort((a, b) => (b.marked === true ? -1 : 1) - (a.marked === true ? -1 : 1));
    }

    // Shuffle
    if (isRandomized) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Limit
    if (cardLimit && cardLimit > 0) {
      arr = arr.slice(0, cardLimit);
    }

    onApply(arr);
  }, [jlptLevels, sortOrder, showBookmarkedOnly, isRandomized, cardLimit, onApply, rawVocabList]); // Added rawVocabList to dependencies

  const handleCustomLimitChange = useCallback((e) => {
    setCustomLimit(e.target.value);
  }, []);

  const setCustomCardLimit = useCallback(() => {
    const x = parseInt(customLimit, 10);
    if (!isNaN(x) && x > 0) setCardLimit(x); // Check for NaN
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