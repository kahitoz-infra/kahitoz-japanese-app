"use client";
import { useState, useEffect, useMemo } from "react";
import KanjiCardView from "@/app/components/KanjiCardView";
import KanjiTableView from "@/app/components/Table";
import DrawCardView from "@/app/components/DrawCardView";
import Image from "next/image";
import Link from "next/link";

const api = process.env.NEXT_PUBLIC_API_URL;
const CACHE_EXPIRATION_HOURS = 12;
const LS_KEYS = {
  kanji: "kanjiDataCache",
  tags: "kanjiTagsCache",
  timestamp: "kanjiCacheTimestamp",
  originalBookmarks: "bookmarkedOriginal",
  modifiedBookmarks: "bookmarkedModified",
  viewType: "prefViewType",
  selectedLabel: "prefSelectedLabel",
  bookmarksOnly: "prefBookmarksOnly",
  randomizeMode: "prefRandomizeMode",
  customGroupSize: "prefCustomGroupSize",
  sound: "prefSound",
  showFilters: "prefShowFilters",
};

const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const shuffleInGroups = (arr, groupSize) => {
  if (groupSize <= 0) return arr;
  const result = [];
  for (let i = 0; i < arr.length; i += groupSize) {
    result.push(...shuffleArray(arr.slice(i, i + groupSize)));
  }
  return result;
};

const getBookmarkMap = (data) =>
    data.reduce((map, item) => {
      map[item.uid] = item.marked;
      return map;
    }, {});

export default function HomePage() {
  const [viewType, setViewType] = useState("Cards");
  const [selectedLabel, setSelectedLabel] = useState("N4");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [randomizeMode, setRandomizeMode] = useState("None");
  const [customGroupSize, setCustomGroupSize] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [kanjiData, setKanjiData] = useState([]);
  const [tags, setTags] = useState([]);
  const [sound, setSound] = useState(true);

  // Load saved preferences
  useEffect(() => {
    const storedViewType = localStorage.getItem(LS_KEYS.viewType);
    const storedLabel = localStorage.getItem(LS_KEYS.selectedLabel);
    const storedBookmarks = localStorage.getItem(LS_KEYS.bookmarksOnly);
    const storedRandomMode = localStorage.getItem(LS_KEYS.randomizeMode);
    const storedCustomGroupSize = localStorage.getItem(LS_KEYS.customGroupSize);
    const storedSound = localStorage.getItem(LS_KEYS.sound);
    const storedFilters = localStorage.getItem(LS_KEYS.showFilters);

    if (storedViewType) setViewType(storedViewType);
    if (storedLabel) setSelectedLabel(storedLabel);
    if (storedBookmarks) setShowBookmarksOnly(storedBookmarks === "true");
    if (storedRandomMode) setRandomizeMode(storedRandomMode);
    if (storedCustomGroupSize) setCustomGroupSize(storedCustomGroupSize);
    if (storedSound) setSound(storedSound === "true");
    if (storedFilters) setShowFilters(storedFilters === "true");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const cachedKanji = localStorage.getItem(LS_KEYS.kanji);
      const cachedTags = localStorage.getItem(LS_KEYS.tags);
      const cachedTimestamp = localStorage.getItem(LS_KEYS.timestamp);
      const now = Date.now();
      const isCacheValid =
          cachedKanji &&
          cachedTags &&
          cachedTimestamp &&
          now - parseInt(cachedTimestamp, 10) < CACHE_EXPIRATION_HOURS * 3600000;

      if (isCacheValid) {
        const parsedKanji = JSON.parse(cachedKanji);
        setKanjiData(parsedKanji);
        setTags(JSON.parse(cachedTags));
        localStorage.setItem(LS_KEYS.originalBookmarks, JSON.stringify(getBookmarkMap(parsedKanji)));
        localStorage.setItem(LS_KEYS.modifiedBookmarks, JSON.stringify(getBookmarkMap(parsedKanji)));
      } else {
        try {
          const [kanjiResp, tagResp] = await Promise.all([
            fetch(`${api}/flagged_kanjis?user_id=1`),
            fetch(`${api}/tags`),
          ]);
          const kanjiJson = await kanjiResp.json();
          const tagJson = await tagResp.json();

          setKanjiData(kanjiJson);
          setTags(tagJson.result || []);
          localStorage.setItem(LS_KEYS.kanji, JSON.stringify(kanjiJson));
          localStorage.setItem(LS_KEYS.tags, JSON.stringify(tagJson.result || []));
          localStorage.setItem(LS_KEYS.timestamp, now.toString());
        } catch (e) {
          console.error("Failed to fetch data", e);
        }
      }
    };

    fetchData();
  }, []);

  const filteredKanji = useMemo(() => {
    let filtered = [...kanjiData].sort((a, b) => a.uid - b.uid);

    if (selectedLabel !== "All") {
      filtered = filtered.filter((k) => k.tags === selectedLabel);
    }

    if (showBookmarksOnly) {
      filtered = filtered.filter((k) => k.marked);
    }

    if (randomizeMode === "All") {
      return shuffleArray(filtered);
    }

    if (randomizeMode === "Custom" || !isNaN(randomizeMode)) {
      const groupSize = parseInt(customGroupSize || randomizeMode, 10);
      if (groupSize > 0) {
        return shuffleInGroups(filtered, groupSize);
      }
    }

    return filtered;
  }, [kanjiData, selectedLabel, showBookmarksOnly, randomizeMode, customGroupSize]);

  const handleBookmarkToggle = (kanjiId, shouldBookmark) => {
    const updated = kanjiData.map(k => k.uid === kanjiId ? { ...k, marked: shouldBookmark } : k);
    setKanjiData(updated);

    const modified = JSON.parse(localStorage.getItem(LS_KEYS.modifiedBookmarks) || "{}");
    modified[kanjiId] = shouldBookmark;
    localStorage.setItem(LS_KEYS.modifiedBookmarks, JSON.stringify(modified));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const original = JSON.parse(localStorage.getItem(LS_KEYS.originalBookmarks) || "{}");
      const modified = JSON.parse(localStorage.getItem(LS_KEYS.modifiedBookmarks) || "{}");

      const changes = Object.entries(modified)
          .filter(([id, value]) => original[id] !== value)
          .map(([id, value]) => ({
            kanji_id: parseInt(id, 10),
            operation_type: value,
            user_id: 1,
          }));

      if (changes.length > 0) {
        Promise.all(changes.map(change =>
            fetch(`${api}/update_flag`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(change),
            })
        ))
            .then(() => {
              localStorage.setItem(LS_KEYS.originalBookmarks, JSON.stringify(modified));
            })
            .catch((e) => console.error("Failed to sync bookmarks:", e));
      }
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  return (
      <div>
        <div className="fixed top-0 p-2 left-0 right-0 bg-opacity-90 z-10">
          <div className="flex items-center justify-between">
            <Link href="/Dashboard">
              <Image src="/icons/back.svg" alt="back" width={40} height={40} />
            </Link>
            <div className="flex items-center gap-x-2">
              <Image
                  src={sound ? "/icons/sound.svg" : "/icons/mute.svg"}
                  alt="sound"
                  width={40}
                  height={40}
                  onClick={() => {
                    const newVal = !sound;
                    setSound(newVal);
                    localStorage.setItem(LS_KEYS.sound, newVal.toString());
                  }}
              />
              <Image
                  src={showFilters ? "/icons/show.svg" : "/icons/hide.svg"}
                  alt="toggle filters"
                  width={40}
                  height={40}
                  onClick={() => {
                    const newVal = !showFilters;
                    setShowFilters(newVal);
                    localStorage.setItem(LS_KEYS.showFilters, newVal.toString());
                  }}
              />
            </div>
          </div>

          {showFilters && (
              <div className="flex flex-wrap gap-x-2 mt-2 justify-start lg:justify-end">
                <select value={viewType} onChange={(e) => {
                  setViewType(e.target.value);
                  localStorage.setItem(LS_KEYS.viewType, e.target.value);
                }} className="select-box w-20 text-black bg-white dark:text-white dark:bg-black">
                  <option value="Cards">Cards</option>
                  <option value="Table">Table</option>
                  <option value="Draw">Draw</option>
                </select>

                <Image src="/icons/rightarrow.svg" alt="arrow" width={25} height={12} />

                <select value={selectedLabel} onChange={(e) => {
                  setSelectedLabel(e.target.value);
                  localStorage.setItem(LS_KEYS.selectedLabel, e.target.value);
                }} className="select-box w-14 text-black bg-white dark:text-white dark:bg-black">
                  <option value="N4">N4</option>
                  <option value="N5">N5</option>
                  {tags.filter(tag => !["N4", "N5"].includes(tag)).map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>

                <Image src="/icons/rightarrow.svg" alt="arrow" width={25} height={12} />

                <select value={showBookmarksOnly ? "Bookmarked" : "All"} onChange={(e) => {
                  const val = e.target.value === "Bookmarked";
                  setShowBookmarksOnly(val);
                  localStorage.setItem(LS_KEYS.bookmarksOnly, val.toString());
                }} className="select-box w-16 text-black bg-white dark:text-white dark:bg-black">
                  <option value="All">All</option>
                  <option value="Bookmarked">Bookmarked</option>
                </select>

                <Image src="/icons/rightarrow.svg" alt="arrow" width={25} height={12} />

                <select
                    value={randomizeMode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRandomizeMode(val);
                      localStorage.setItem(LS_KEYS.randomizeMode, val);
                      if (val !== "Custom") {
                        setCustomGroupSize("");
                        localStorage.removeItem(LS_KEYS.customGroupSize);
                      }
                    }}
                    className="select-box w-48 text-black bg-white dark:text-white dark:bg-black"
                >
                  <option value="None">Stop Randomization</option>
                  <option value="All">Randomize All</option>
                  <option value="5">Groups of 5</option>
                  <option value="10">Groups of 10</option>
                  <option value="15">Groups of 15</option>
                  <option value="Custom">Custom Group</option>
                </select>
              </div>
          )}
        </div>

        {randomizeMode === "Custom" && (
            <input
                type="text"
                placeholder="Enter group size"
                value={customGroupSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setCustomGroupSize(val);
                    localStorage.setItem(LS_KEYS.customGroupSize, val);
                  }
                }}
                className="p-2 rounded-md w-36 mt-2 ml-2"
            />
        )}

        <div className="h-screen w-screen flex items-center justify-center">
          {viewType === "Cards" && <KanjiCardView kanjiList={filteredKanji} onBookmarkToggle={handleBookmarkToggle} sound={sound} />}
          {viewType === "Table" && <KanjiTableView kanjiList={filteredKanji} />}
          {viewType === "Draw" && <DrawCardView kanjiList={filteredKanji} />}
        </div>
      </div>
  );
}
