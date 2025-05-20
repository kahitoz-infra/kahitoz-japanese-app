"use client";
import { useState, useEffect } from "react";
import KanjiCardView from "@/app/components/KanjiCardView";
import KanjiTableView from "@/app/components/Table";

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleInGroups(arr, groupSize) {
  if (groupSize <= 0) return arr;
  const result = [];
  for (let i = 0; i < arr.length; i += groupSize) {
    const group = arr.slice(i, i + groupSize);
    result.push(...shuffleArray(group));
  }
  return result;
}

export default function HomePage() {
  const [viewType, setViewType] = useState("Cards");
  const [selectedLabel, setSelectedLabel] = useState("N4");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // randomizeMode can be 'None', 'All', '5', '10', '15', 'Custom'
  const [randomizeMode, setRandomizeMode] = useState("None");
  const [customGroupSize, setCustomGroupSize] = useState("");

  const [kanjiData, setKanjiData] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredKanji, setFilteredKanji] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const kanjiResp = await fetch(
            "https://apizenkanji.kahitoz.com/v1/flagged_kanjis?user_id=1"
        );
        const kanjiJson = await kanjiResp.json();

        const tagResp = await fetch("https://apizenkanji.kahitoz.com/v1/tags");
        const tagJson = await tagResp.json();

        setKanjiData(kanjiJson);
        setTags(tagJson.result || []);
      } catch (e) {
        console.error("Failed to fetch data", e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!kanjiData) return;

    let filtered = kanjiData;

    // Filter by label
    if (selectedLabel !== "All") {
      filtered = filtered.filter((k) => k.tags === selectedLabel);
    }

    // Filter bookmarks
    if (showBookmarksOnly) {
      filtered = filtered.filter((k) => k.marked === true);
    }

    // Randomize logic
    if (randomizeMode === "None") {
      // no shuffle
    } else if (randomizeMode === "All") {
      filtered = shuffleArray(filtered);
    } else {
      // If custom group or fixed group sizes
      let groupSize;
      if (randomizeMode === "Custom") {
        groupSize = parseInt(customGroupSize, 10);
      } else {
        groupSize = parseInt(randomizeMode, 10);
      }
      if (groupSize > 0) {
        filtered = shuffleInGroups(filtered, groupSize);
      }
    }

    setFilteredKanji(filtered);
  }, [kanjiData, selectedLabel, showBookmarksOnly, randomizeMode, customGroupSize]);

  // Handle custom input change
  function onCustomGroupSizeChange(e) {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setCustomGroupSize(val);
    }
  }

  return (
      <div className="min-h-screen w-screen">
        <div className="fixed top-0 left-0 right-0 z-20 flex flex-wrap items-center justify-center p-4 space-x-4 bg-white dark:bg-black">
          {/* View Type */}
          <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="p-2 rounded-md"
          >
            <option value="Cards">Cards</option>
            <option value="Table">Table</option>
          </select>

          {/* Label Filter */}
          <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
              className="p-2 rounded-md"
          >
            <option value="N4">N4</option>
            <option value="N5">N5</option>
            <option value="All">All</option>
            {tags
                .filter((t) => !["N4", "N5"].includes(t))
                .map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                ))}
          </select>

          {/* Bookmark Filter */}
          <select
              value={showBookmarksOnly ? "Bookmarked" : "All"}
              onChange={(e) => setShowBookmarksOnly(e.target.value === "Bookmarked")}
              className="p-2 rounded-md"
          >
            <option value="All">All</option>
            <option value="Bookmarked">Bookmarked</option>
          </select>

          {/* Randomization select */}
          <select
              value={randomizeMode}
              onChange={(e) => {
                setRandomizeMode(e.target.value);
                if (e.target.value !== "Custom") {
                  setCustomGroupSize("");
                }
              }}
              className="p-2 rounded-md"
          >
            <option value="None">Stop Randomization</option>
            <option value="All">Randomize All</option>
            <option value="5">Randomize in groups of 5</option>
            <option value="10">Randomize in groups of 10</option>
            <option value="15">Randomize in groups of 15</option>
            <option value="Custom">Custom Group Size</option>
          </select>

          {/* Custom group size input, only visible if Custom is selected */}
          {randomizeMode === "Custom" && (
              <input
                  type="text"
                  placeholder="Enter group size"
                  value={customGroupSize}
                  onChange={onCustomGroupSizeChange}
                  className="p-2 rounded-md w-36"
              />
          )}
        </div>

        <div className="pt-24">
          {viewType === "Cards" ? (
              <KanjiCardView kanjiList={filteredKanji} setKanjiData={setKanjiData} />
          ) : (
              <KanjiTableView kanjiList={filteredKanji} />
          )}
        </div>
      </div>
  );
}
