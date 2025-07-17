"use client";
import React, { useState, useEffect } from "react";

export default function SettingsKanjiModal({
  setOpenModal,
  setFilteredData,
  setBookmark,
}) {
  const [levels, setLevels] = useState([]);
  const [kanjiSelectedLevels, setSelectedLevels] = useState([]);
  const [kanjiBookMarkCheck, setKanjiBookMarkCheck] = useState(false);
  const [kanjiIncludeBookmarks, setKanjiIncludeBookMarks] = useState(true)

  useEffect(() => {
    if (kanjiBookMarkCheck) {
      setKanjiIncludeBookMarks(false);
    }
  }, [kanjiBookMarkCheck]);

  useEffect(() => {
    const localKanjiData = localStorage.getItem("cacheKanji");
    const savedSelected = localStorage.getItem("kanjiSelectedLevels");
    const saveBookMark = localStorage.getItem("kanjiBookMarkChecked");
    const includeBookMark = localStorage.getItem("kanjiBookMarkInclude");

    if (localKanjiData) {
      const data = JSON.parse(localKanjiData);
      const uniqueLevels = [...new Set(data.map((item) => item.tags))];
      setLevels(uniqueLevels);
    }

    if (savedSelected) {
      setSelectedLevels(JSON.parse(savedSelected));
    }

    if (saveBookMark !== null) {
      setKanjiBookMarkCheck(saveBookMark === "true");
    }

    if (includeBookMark !== null) {
      setKanjiIncludeBookMarks(includeBookMark === "true");
    }
  }, []);

  const applyFiltersAndReturnData = () => {
    const localKanjiData = localStorage.getItem("cacheKanji");
    if (!localKanjiData) return [];

    let parsedData = JSON.parse(localKanjiData);
    console.log("Initial data count:", parsedData.length);

    // If "Show Bookmarks Only" is checked
    if (kanjiBookMarkCheck) {
      parsedData = parsedData.filter((item) => item.marked === true);
      console.log("After bookmark filter:", parsedData.length);
    } else {
      // If "Include Bookmarks" is NOT checked, exclude bookmarked items
      if (!kanjiIncludeBookmarks) {
        parsedData = parsedData.filter((item) => !item.marked);
        console.log("After excluding bookmarks:", parsedData.length);
      }
    }

    // Apply level filtering if any level is selected
    if (kanjiSelectedLevels.length > 0) {
      parsedData = parsedData.filter((item) =>
        kanjiSelectedLevels.includes(item.tags)
      );
      console.log("After level filter:", parsedData.length);
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
                const isSelected = kanjiSelectedLevels.includes(lvl);
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
              checked={kanjiIncludeBookmarks}
              onChange={(e) => setKanjiIncludeBookMarks(e.target.checked)}
              className="mr-2"
            />
            <label>Include Bookmarks</label>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block mb-2">Sort By:</label>
            <select
              className="w-full p-2 border rounded dark:bg-[#292b2d]"
              defaultValue="tags"
            >
              <option value="default">Default</option>
              <option value="tags">By Level</option>
              <option value="bookmarked">Bookmarked First</option>
            </select>
          </div>

          {/* Bookmarked Only */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={kanjiBookMarkCheck}
              onChange={(e) => setKanjiBookMarkCheck(e.target.checked)}
              className="mr-2"
            />

            <label>Show Bookmarked Only</label>
          </div>

          {/* Randomized */}
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label>Randomize Order</label>
          </div>

          {/* Card Limit */}
          <div>
            <label className="block mb-2">Card Limit:</label>
            <div className="flex gap-2 mb-2">
              {[5, 10, 15].map((n, i) => (
                <button
                  key={n}
                  className={`px-3 py-1 rounded ${
                    n === 10
                      ? "bg-[#de3163] dark:bg-[#FF6600] text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">
                All
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Custom"
                className="flex-1 p-2 border rounded dark:bg-[#292b2d]"
              />
              <button className="px-3 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded">
                Set
              </button>
            </div>
          </div>

          {/* Apply */}
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-[#de3163] dark:bg-[#FF6600] text-white rounded"
              onClick={() => {
                localStorage.setItem(
                  "kanjiSelectedLevels",
                  JSON.stringify(kanjiSelectedLevels)
                );
                localStorage.setItem(
                  "kanjiBookMarkChecked",
                  kanjiBookMarkCheck.toString()
                );
                setBookmark(kanjiBookMarkCheck);

                localStorage.setItem(
                  "kanjiBookMarkInclude",
                  kanjiIncludeBookmarks.toString()
                )

                const filtered = applyFiltersAndReturnData();
                setFilteredData(filtered);

                const localKanjiData = localStorage.getItem("cacheKanji");
                if (localKanjiData) {
                  let parsed = JSON.parse(localKanjiData);

                  // Filter by selected levels (if any)
                  if (kanjiSelectedLevels.length > 0) {
                    parsed = parsed.filter((item) =>
                      kanjiSelectedLevels.includes(item.tags)
                    );
                  }

                  // Filter by bookmark if checked
                  if (kanjiBookMarkCheck) {
                    parsed = parsed.filter((item) => item.bookmarked === true);
                  }
                }
                localStorage.setItem(
                  "filteredKanjiData",
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
