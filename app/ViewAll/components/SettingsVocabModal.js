"use client";
import React, { useState, useEffect } from "react";

export default function SettingsVocabModal({
  setOpenModal,
  setFilteredData,
  setBookmark,
}) {
  const [levels, setLevels] = useState([]);
  const [vocabSelectedLevels, setSelectedLevels] = useState([]);
  const [vocabBookMarkCheck, setVocabBookMarkCheck] = useState(false);

  useEffect(() => {
    const localVocabData = localStorage.getItem("cacheVocab");
    const savedSelected = localStorage.getItem("vocabSelectedLevels");
    const saveBookMark = localStorage.getItem("vocabBookMarkChecked");

    if (localVocabData) {
      const data = JSON.parse(localVocabData);
      const uniqueLevels = [...new Set(data.map((item) => item.level))];
      setLevels(uniqueLevels);
    }

    if (savedSelected) {
      setSelectedLevels(JSON.parse(savedSelected));
    }

    if (saveBookMark !== null) {
      setVocabBookMarkCheck(saveBookMark === "true");
    }
  }, []);

  const applyFiltersAndReturnData = () => {
    const localVocabData = localStorage.getItem("cacheVocab");
    if (!localVocabData) return [];

    let parsedData = JSON.parse(localVocabData);
    console.log("Initial data count:", parsedData.length);

    // If bookmark filter is checked
    if (vocabBookMarkCheck) {
      parsedData = parsedData.filter((item) => item.marked === true);
      console.log("After bookmark filter:", parsedData.length);

      // Then also apply level filtering if levels are selected
      if (vocabSelectedLevels.length > 0) {
        parsedData = parsedData.filter((item) =>
          vocabSelectedLevels.includes(item.level)
        );
        console.log("After bookmark + level filter:", parsedData.length);
      }
    } else {
      // Bookmark is NOT checked → Apply only level filtering if selected
      if (vocabSelectedLevels.length > 0) {
        parsedData = parsedData.filter((item) =>
          vocabSelectedLevels.includes(item.level)
        );
        console.log("After level-only filter:", parsedData.length);
      }
    }

    console.log("This is the parsed data -", parsedData);

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
                const isSelected = vocabSelectedLevels.includes(lvl);
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
              checked={vocabBookMarkCheck}
              onChange={(e) => setVocabBookMarkCheck(e.target.checked)}
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
                  "vocabSelectedLevels",
                  JSON.stringify(vocabSelectedLevels)
                );
                localStorage.setItem(
                  "vocabBookMarkChecked",
                  vocabBookMarkCheck.toString()
                );
                setBookmark(vocabBookMarkCheck);

                const filtered = applyFiltersAndReturnData();
                setFilteredData(filtered);

                const localVocabData = localStorage.getItem("cacheVocab");
                if (localVocabData) {
                  let parsed = JSON.parse(localVocabData);

                  // Filter by selected levels (if any)
                  if (vocabSelectedLevels.length > 0) {
                    parsed = parsed.filter((item) =>
                      vocabSelectedLevels.includes(item.level)
                    );
                  }

                  // Filter by bookmark if checked
                  if (vocabBookMarkCheck) {
                    parsed = parsed.filter((item) => item.bookmarked === true);
                  }
                }
                localStorage.setItem(
                  "filteredVocabData",
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
