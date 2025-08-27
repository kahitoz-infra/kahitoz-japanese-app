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
  const [customLimit, setCustomLimit] = useState("");

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
    const savedLimit = localStorage.getItem("verbCardLimit");

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

    if (savedLimit !== null) {
      setCardLimit(savedLimit === "all" ? "all" : parseInt(savedLimit, 10));
    }
  }, []);

  const applyFiltersAndReturnData = () => {
    const localVerbData = localStorage.getItem("cacheVerb");
    if (!localVerbData) return [];

    let parsedData = JSON.parse(localVerbData);
    console.log("Initial data count:", parsedData.length);

    if (verbBookMarkCheck) {
      parsedData = parsedData.filter((item) => item.marked === true);
      console.log("After bookmark filter:", parsedData.length);
    } else {
      if (!verbIncludeBookmarks) {
        parsedData = parsedData.filter((item) => !item.marked);
        console.log("After excluding bookmarks:", parsedData.length);
      }
    }

    if (verbSelectedLevels.length > 0) {
      parsedData = parsedData.filter((item) =>
        verbSelectedLevels.includes(item.level)
      );
      console.log("After level filter:", parsedData.length);
    }

    if (cardLimit && cardLimit !== "all") {
      parsedData = parsedData.slice(0, cardLimit);
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

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={verbBookMarkCheck}
              onChange={(e) => setVerbBookMarkCheck(e.target.checked)}
              className="mr-2"
            />
            <label>Show Bookmarked Only</label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label>Randomize Order</label>
          </div>

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
                  cardLimit === "all"
                    ? "bg-[#de3163] dark:bg-[#FF6600] text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => setCardLimit("all")}
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
                  if (customLimit && parseInt(customLimit, 10) > 0) {
                    setCardLimit(parseInt(customLimit, 10));
                  }
                }}
              >
                Set
              </button>
            </div>
          </div>

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
                );

                localStorage.setItem(
                  "verbCardLimit",
                  cardLimit?.toString() ?? "all"
                );

                const filtered = applyFiltersAndReturnData();
                setFilteredData(filtered);

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