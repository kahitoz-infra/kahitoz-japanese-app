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
  const [verbIncludeBookmarks, setVerbIncludeBookMarks] = useState(true)

  useEffect(() => {
    if (verbBookMarkCheck) {
      setVerbIncludeBookMarks(false);
    }
  }, [verbBookMarkCheck]);

  useEffect(() => {
    const localVerbData = localStorage.getItem("cacheVerb");
    const savedSelected = localStorage.getItem("verbSelectedLevels");
    const saveBookMark = localStorage.getItem("verbBookMarkChecked");
    const includeBookMark = localStorage.getItem("verbBookMarkInclude");

    if (localVerbData) {
      const data = JSON.parse(localVerbData);
      const uniqueLevels = [...new Set(data.map((item) => item.level))];
      setLevels(uniqueLevels);
    }

    if (savedSelected) {
      setSelectedLevels(JSON.parse(savedSelected));
    }

    if (saveBookMark !== null) {
      setVerbBookMarkCheck(saveBookMark === "true");
    }

    if (includeBookMark !== null) {
      setVerbIncludeBookMarks(includeBookMark === "true");
    }
  }, []);

  const applyFiltersAndReturnData = () => {
    const localVerbData = localStorage.getItem("cacheVerb");
    if (!localVerbData) return [];

    let parsedData = JSON.parse(localVerbData);
    console.log("Initial data count:", parsedData.length);

    // If "Show Bookmarks Only" is checked
    if (verbBookMarkCheck) {
      parsedData = parsedData.filter((item) => item.marked === true);
      console.log("After bookmark filter:", parsedData.length);
    } else {
      // If "Include Bookmarks" is NOT checked, exclude bookmarked items
      if (!verbIncludeBookmarks) {
        parsedData = parsedData.filter((item) => !item.marked);
        console.log("After excluding bookmarks:", parsedData.length);
      }
    }

    // Apply level filtering if any level is selected
    if (verbSelectedLevels.length > 0) {
      parsedData = parsedData.filter((item) =>
        verbSelectedLevels.includes(item.level)
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

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={verbIncludeBookmarks}
              onChange={(e) => setVerbIncludeBookMarks(e.target.checked)}
              className="mr-2"
            />
            <label>Include Bookmarks</label>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block mb-2">Sort By:</label>
            <select
              className="w-full p-2 border rounded dark:bg-[#292b2d]"
              defaultValue="level"
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
                  "verbSelectedLevels",
                  JSON.stringify(verbSelectedLevels)
                );
                localStorage.setItem(
                  "verbBookMarkChecked",
                  verbBookMarkCheck.toString()
                );
                setBookmark(verbBookMarkCheck);

                localStorage.setItem(
                  "verbBookMarkInclude",
                  verbIncludeBookmarks.toString()
                )

                const filtered = applyFiltersAndReturnData();
                setFilteredData(filtered);

                const localVerbData = localStorage.getItem("cacheVerb");
                if (localVerbData) {
                  let parsed = JSON.parse(localVerbData);

                  // Filter by selected levels (if any)
                  if (verbSelectedLevels.length > 0) {
                    parsed = parsed.filter((item) =>
                      verbSelectedLevels.includes(item.level)
                    );
                  }

                  // Filter by bookmark if checked
                  if (verbBookMarkCheck) {
                    parsed = parsed.filter((item) => item.bookmarked === true);
                  }
                }
                localStorage.setItem(
                  "filteredVerbData",
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
