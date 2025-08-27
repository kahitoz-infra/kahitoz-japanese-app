"use client";
import React, { useState, useEffect } from "react";

export default function SettingsVerbModal({
  setOpenModal,
  setFilteredData,
  setBookmark,
}) {
  const [levels, setLevels] = useState([]);
  const [verbSelectedLevels, setSelectedLevels] = useState([]);
  const [verbBookMarkCheck, setVerbBookMarkCheck] = useState(false);
  const [verbIncludeBookmarks, setVerbIncludeBookMarks] = useState(true);
  const [cardLimit, setCardLimit] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [randomize, setRandomize] = useState(false);

  // keep "include bookmarks" and "show only bookmarks" mutually exclusive
  useEffect(() => {
    if (verbBookMarkCheck) {
      setVerbIncludeBookMarks(false);
    }
  }, [verbBookMarkCheck]);

  // load settings from localStorage
  useEffect(() => {
    const localVerbData = localStorage.getItem("cacheVerb");
    const savedSelected = localStorage.getItem("verbSelectedLevels");
    const saveBookMark = localStorage.getItem("verbBookMarkChecked");
    const includeBookMark = localStorage.getItem("verbBookMarkInclude");
    const savedCardLimit = localStorage.getItem("verbCardLimit");
    const savedSort = localStorage.getItem("verbSortOrder");
    const savedRandom = localStorage.getItem("verbRandomize");

    if (localVerbData) {
      const data = JSON.parse(localVerbData);
      const uniqueLevels = [...new Set(data.map((item) => item.level))];
      setLevels(uniqueLevels);
    }
    if (savedSelected) setSelectedLevels(JSON.parse(savedSelected));
    if (saveBookMark !== null) setVerbBookMarkCheck(saveBookMark === "true");
    if (includeBookMark !== null)
      setVerbIncludeBookMarks(includeBookMark === "true");
    if (savedCardLimit !== null) setCardLimit(Number(savedCardLimit));
    if (savedSort) setSortOrder(savedSort);
    if (savedRandom !== null) setRandomize(savedRandom === "true");
  }, []);

  // main filter/sort/limit function
  const applyFiltersAndReturnData = () => {
    const localVerbData = localStorage.getItem("cacheVerb");
    if (!localVerbData) return [];

    let parsedData = JSON.parse(localVerbData);

    // bookmark filters
    if (verbBookMarkCheck) {
      parsedData = parsedData.filter((item) => item.marked === true);
    } else if (!verbIncludeBookmarks) {
      parsedData = parsedData.filter((item) => !item.marked);
    }

    // level filter
    if (verbSelectedLevels.length > 0) {
      parsedData = parsedData.filter((item) =>
        verbSelectedLevels.includes(item.level)
      );
    }

    // sort
    if (sortOrder === "level") {
      parsedData.sort((a, b) => (a.level > b.level ? 1 : -1));
    } else if (sortOrder === "bookmarked") {
      parsedData.sort((a, b) => (b.marked === true) - (a.marked === true));
    }

    // randomize
    if (randomize) {
      for (let i = parsedData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [parsedData[i], parsedData[j]] = [parsedData[j], parsedData[i]];
      }
    }

    // limit
    if (cardLimit && cardLimit > 0) {
      parsedData = parsedData.slice(0, cardLimit);
    }

    return parsedData;
  };

  const handleApply = () => {
    localStorage.setItem(
      "verbSelectedLevels",
      JSON.stringify(verbSelectedLevels)
    );
    localStorage.setItem("verbBookMarkChecked", verbBookMarkCheck.toString());
    localStorage.setItem("verbBookMarkInclude", verbIncludeBookmarks.toString());
    localStorage.setItem("verbCardLimit", cardLimit ?? "");
    localStorage.setItem("verbSortOrder", sortOrder);
    localStorage.setItem("verbRandomize", randomize.toString());

    setBookmark(verbBookMarkCheck);

    const filtered = applyFiltersAndReturnData();
    setFilteredData(filtered);
    localStorage.setItem("filteredVerbData", JSON.stringify(filtered));

    setOpenModal(false);
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
                const isSelected = verbSelectedLevels.includes(lvl);
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

          {/* Include Bookmarks */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={verbIncludeBookmarks}
              onChange={(e) => setVerbIncludeBookMarks(e.target.checked)}
              disabled={verbBookMarkCheck}
              className="mr-2"
            />
            <label>Include Bookmarks</label>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block mb-2">Sort By:</label>
            <select
              className="w-full p-2 border rounded dark:bg-[#292b2d]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
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
              checked={verbBookMarkCheck}
              onChange={(e) => setVerbBookMarkCheck(e.target.checked)}
              className="mr-2"
            />
            <label>Show Bookmarked Only</label>
          </div>

          {/* Randomized */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={randomize}
              onChange={(e) => setRandomize(e.target.checked)}
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
                  onClick={() => setCardLimit(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className={`px-3 py-1 rounded ${
                  cardLimit === null
                    ? "bg-[#de3163] dark:bg-[#FF6600] text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => setCardLimit(null)}
              >
                All
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Custom"
                className="flex-1 p-2 border rounded dark:bg-[#292b2d]"
                onChange={(e) =>
                  setCardLimit(e.target.value ? Number(e.target.value) : null)
                }
              />
              <button
                className="px-3 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
                onClick={() => setCardLimit(cardLimit)}
              >
                Set
              </button>
            </div>
          </div>

          {/* Apply */}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
