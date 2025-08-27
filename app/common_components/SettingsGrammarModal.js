"use client";
import React, { useState, useEffect } from "react";

export default function SettingsGrammarModal({
  setOpenModal,
  setFilteredData,
  setBookmark,
}) {
  const [levels, setLevels] = useState([]);
  const [grammarSelectedLevels, setSelectedLevels] = useState([]);
  const [grammarBookMarkCheck, setGrammarBookMarkCheck] = useState(false);
  const [grammarIncludeBookmarks, setGrammarIncludeBookMarks] = useState(true);
  const [cardLimit, setCardLimit] = useState(10);
  const [customLimit, setCustomLimit] = useState("");
  const [isRandomized, setIsRandomized] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (grammarBookMarkCheck) {
      setGrammarIncludeBookMarks(false);
    }
  }, [grammarBookMarkCheck]);

  useEffect(() => {
    const localGrammarData = localStorage.getItem("cacheGrammar");
    const savedSelected = localStorage.getItem("grammarSelectedLevels");
    const saveBookMark = localStorage.getItem("grammarBookMarkChecked");
    const includeBookMark = localStorage.getItem("grammarBookMarkInclude");
    const savedCardLimit = localStorage.getItem("grammarCardLimit");
    const savedRandomized = localStorage.getItem("grammarRandomized");
    const savedSortBy = localStorage.getItem("grammarSortBy");

    if (localGrammarData) {
      const data = JSON.parse(localGrammarData);
      const uniqueLevels = [...new Set(data.map((item) => item.level))];
      setLevels(uniqueLevels);
    }

    if (savedSelected) {
      setSelectedLevels(JSON.parse(savedSelected));
    }

    if (saveBookMark !== null) {
      setGrammarBookMarkCheck(saveBookMark === "true");
    }

    if (includeBookMark !== null) {
      setGrammarIncludeBookMarks(includeBookMark === "true");
    }

    if (savedCardLimit !== null) {
      setCardLimit(savedCardLimit === "all" ? "all" : parseInt(savedCardLimit));
    }

    if (savedRandomized !== null) {
      setIsRandomized(savedRandomized === "true");
    }

    if (savedSortBy !== null) {
      setSortBy(savedSortBy);
    }
  }, []);

  const applyFiltersAndReturnData = () => {
    const localGrammarData = localStorage.getItem("cacheGrammar");
    if (!localGrammarData) return [];

    let parsedData = JSON.parse(localGrammarData);
    console.log("Initial data count:", parsedData.length);

    // If "Show Bookmarks Only" is checked
    if (grammarBookMarkCheck) {
      parsedData = parsedData.filter((item) => item.marked === true);
      console.log("After bookmark filter:", parsedData.length);
    } else {
      // If "Include Bookmarks" is NOT checked, exclude bookmarked items
      if (!grammarIncludeBookmarks) {
        parsedData = parsedData.filter((item) => !item.marked);
        console.log("After excluding bookmarks:", parsedData.length);
      }
    }

    // Apply level filtering if any level is selected
    if (grammarSelectedLevels.length > 0) {
      parsedData = parsedData.filter((item) =>
        grammarSelectedLevels.includes(item.level)
      );
      console.log("After level filter:", parsedData.length);
    }

    // Apply sorting
    if (sortBy === "level") {
      parsedData.sort((a, b) => {
        const levelOrder = { "N5": 1, "N4": 2, "N3": 3, "N2": 4, "N1": 5 };
        return (levelOrder[a.level] || 999) - (levelOrder[b.level] || 999);
      });
      console.log("After level sorting");
    } else if (sortBy === "bookmarked") {
      parsedData.sort((a, b) => {
        if (a.marked && !b.marked) return -1;
        if (!a.marked && b.marked) return 1;
        return 0;
      });
      console.log("After bookmark sorting");
    }

    // Apply randomization if enabled (after sorting, if both are enabled)
    if (isRandomized) {
      parsedData = [...parsedData].sort(() => Math.random() - 0.5);
      console.log("After randomization");
    }

    // Apply card limit (if not "All")
    if (cardLimit !== "all") {
      parsedData = parsedData.slice(0, parseInt(cardLimit));
      console.log("After card limit:", parsedData.length);
    }

    console.log("Final parsed data:", parsedData);
    return parsedData;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white border-2 border-red-400 dark:bg-[#292b2d] p-6 rounded-xl w-80 text-black dark:text-gray-200 relative">
        <button
          className="absolute top-2 right-2"
          onClick={() => setOpenModal(false)}
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          {/* JLPT Filter */}
          <div>
            <label className="block mb-2">Filter by JLPT Level:</label>
            <div className="flex flex-wrap gap-2">
              {levels.map((lvl) => {
                const isSelected = grammarSelectedLevels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    className={`px-3 py-1 rounded ${
                      isSelected
                        ? "bg-[#de3163] dark:bg-[#FF6600] text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    }`}
                    onClick={() => {
                      setSelectedLevels((prev) =>
                        prev.includes(lvl)
                          ? prev.filter((item) => item !== lvl)
                          : [...prev, lvl]
                      );
                    }}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={grammarIncludeBookmarks}
              onChange={(e) => setGrammarIncludeBookMarks(e.target.checked)}
              className="mr-2"
            />
            <label>Include Bookmarks</label>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block mb-2">Sort By:</label>
            <select
              className="w-full p-2 border rounded dark:bg-[#292b2d]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="level">By Level</option>
              <option value="bookmarked">Bookmarked First</option>
            </select>
          </div>

          {/* Bookmarked Only */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={grammarBookMarkCheck}
              onChange={(e) => setGrammarBookMarkCheck(e.target.checked)}
              className="mr-2"
            />
            <label>Show Bookmarked Only</label>
          </div>

          {/* Randomized */}
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={isRandomized}
              onChange={(e) => setIsRandomized(e.target.checked)}
              className="mr-2" 
            />
            <label>Randomize Order</label>
          </div>

          {/* Card Limit */}
          <div>
            <label className="block mb-2">Card Limit:</label>
            <div className="flex gap-2 mb-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  className={`px-3 py-1 rounded ${
                    cardLimit === n
                      ? "bg-[#de3163] dark:bg-[#FF6600] text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  onClick={() => {
                    setCardLimit(n);
                    setCustomLimit(""); // Clear custom input
                  }}
                >
                  {n}
                </button>
              ))}
              <button 
                className={`px-3 py-1 rounded ${
                  cardLimit === "all"
                    ? "bg-[#de3163] dark:bg-[#FF6600] text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => {
                  setCardLimit("all");
                  setCustomLimit(""); // Clear custom input
                }}
              >
                All
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Custom"
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                className="flex-1 p-2 border rounded dark:bg-[#292b2d]"
              />
              <button 
                className="px-3 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
                onClick={() => {
                  if (customLimit && parseInt(customLimit) > 0) {
                    setCardLimit(parseInt(customLimit));
                  }
                }}
              >
                Set
              </button>
            </div>
          </div>

          {/* Apply */}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
              onClick={() => {
                // Save all settings to localStorage
                localStorage.setItem(
                  "grammarSelectedLevels",
                  JSON.stringify(grammarSelectedLevels)
                );
                localStorage.setItem(
                  "grammarBookMarkChecked",
                  grammarBookMarkCheck.toString()
                );
                localStorage.setItem(
                  "grammarBookMarkInclude",
                  grammarIncludeBookmarks.toString()
                );
                localStorage.setItem("grammarCardLimit", cardLimit.toString());
                localStorage.setItem("grammarRandomized", isRandomized.toString());
                localStorage.setItem("grammarSortBy", sortBy);

                setBookmark(grammarBookMarkCheck);

                const filtered = applyFiltersAndReturnData();
                setFilteredData(filtered);

                localStorage.setItem(
                  "filteredGrammarData",
                  JSON.stringify(filtered)
                );
                setOpenModal(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}