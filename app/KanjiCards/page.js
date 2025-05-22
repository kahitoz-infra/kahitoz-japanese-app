"use client";
import { useState, useEffect } from "react";
import KanjiCardView from "@/app/components/KanjiCardView";
import KanjiTableView from "@/app/components/Table";
import Image from "next/image";
import Link from "next/link";

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

function getBookmarkMap(data) {
  const map = {};
  data.forEach(item => {
    map[item.uid] = item.marked;
  });
  return map;
}


export default function HomePage() {
  const [viewType, setViewType] = useState("Cards");
  const [selectedLabel, setSelectedLabel] = useState("N4");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // randomizeMode can be 'None', 'All', '5', '10', '15', 'Custom'
  const [randomizeMode, setRandomizeMode] = useState("None");
  const [customGroupSize, setCustomGroupSize] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [kanjiData, setKanjiData] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredKanji, setFilteredKanji] = useState([]);
  const [sound, setSound] = useState(true);
  const CACHE_KEY_KANJI = "kanjiDataCache";
  const CACHE_KEY_TAGS = "kanjiTagsCache";
  const CACHE_TIMESTAMP_KEY = "kanjiCacheTimestamp";
  const CACHE_EXPIRATION_HOURS = 12;
  const LS_KEY_ORIGINAL = "bookmarkedOriginal";
  const LS_KEY_MODIFIED = "bookmarkedModified";


  useEffect(() => {
    async function fetchData() {
      const cachedKanji = localStorage.getItem(CACHE_KEY_KANJI);
      const cachedTags = localStorage.getItem(CACHE_KEY_TAGS);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);


      const now = Date.now();
      const isCacheValid =
          cachedKanji &&
          cachedTags &&
          cachedTimestamp &&
          now - parseInt(cachedTimestamp, 10) < CACHE_EXPIRATION_HOURS * 60 * 60 * 1000;

          if (isCacheValid) {
            const parsedKanji = JSON.parse(cachedKanji);
            setKanjiData(parsedKanji);
            setTags(JSON.parse(cachedTags));
          
            // Save initial bookmark state
            localStorage.setItem(LS_KEY_ORIGINAL, JSON.stringify(getBookmarkMap(parsedKanji)));
            localStorage.setItem(LS_KEY_MODIFIED, JSON.stringify(getBookmarkMap(parsedKanji)));
          } else {
        try {
          const kanjiResp = await fetch("https://apizenkanji.kahitoz.com/v1/flagged_kanjis?user_id=1");
          const kanjiJson = await kanjiResp.json();

          const tagResp = await fetch("https://apizenkanji.kahitoz.com/v1/tags");
          const tagJson = await tagResp.json();

          // Save to state
          setKanjiData(kanjiJson);
          setTags(tagJson.result || []);

          // Save to localStorage
          localStorage.setItem(CACHE_KEY_KANJI, JSON.stringify(kanjiJson));
          localStorage.setItem(CACHE_KEY_TAGS, JSON.stringify(tagJson.result || []));
          localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        } catch (e) {
          console.error("Failed to fetch data", e);
        }
      }
    }

    fetchData();
  }, []);



  useEffect(() => {
    if (!kanjiData) return;
    let filtered = [...kanjiData];

    filtered.sort((a, b) => a.uid - b.uid);

    if (selectedLabel !== "All") {
      filtered = filtered.filter((k) => k.tags === selectedLabel);
    }

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

  const handleBookmarkToggle = (kanjiId, shouldBookmark) => {
    const updatedKanjiData = kanjiData.map(k =>
      k.uid === kanjiId ? { ...k, marked: shouldBookmark } : k
    );
    setKanjiData(updatedKanjiData);
  
    // Update modified bookmarks in localStorage
    const modified = JSON.parse(localStorage.getItem(LS_KEY_MODIFIED) || "{}");
    modified[kanjiId] = shouldBookmark;
    localStorage.setItem(LS_KEY_MODIFIED, JSON.stringify(modified));
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const original = JSON.parse(localStorage.getItem(LS_KEY_ORIGINAL) || "{}");
      const modified = JSON.parse(localStorage.getItem(LS_KEY_MODIFIED) || "{}");
  
      const changes = [];
  
      for (const id in modified) {
        if (modified[id] !== original[id]) {
          changes.push({
            kanji_id: parseInt(id),
            operation_type: modified[id], // true = bookmark, false = unbookmark
            user_id: 1,
          });
        }
      }
  
      // If there are changes, send them
      if (changes.length > 0) {
        Promise.all(changes.map(change =>
          fetch('https://apizenkanji.kahitoz.com/v1/update_flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(change)
          })
        )).then(() => {
          // After syncing, update the original to match modified
          localStorage.setItem(LS_KEY_ORIGINAL, JSON.stringify(modified));
        }).catch((e) => {
          console.error("Failed to sync bookmarks:", e);
        });
      }
    }, 2 * 60 * 1000); // 2 minutes
  
    return () => clearInterval(interval);
  }, []);


  return (
      <div className="">

        <div className={'fixed top-0 p-2 left-0 right-0'}>
          <div className={'flex items-center justify-between'}>
            <Link href="/">
              <Image src="/icons/back.svg" alt="back" width={40} height={40} />
            </Link>
            <div>

              <div className={'flex items-center justify-center gap-x-2'}>
                {sound && <Image src={'icons/sound.svg'} alt={'sound'} width={40} height={40} onClick={()=>setSound(false)} /> }
                {!sound && <Image src={'icons/mute.svg'} alt={'sound'} width={40} height={40} onClick={()=>setSound(true)} /> }
                {showFilters && <Image src={'icons/show.svg'} alt={'show'} width={40} height={40} onClick={()=>setShowFilters(false)}/>}
                {!showFilters && <Image src={'icons/hide.svg'} alt={'show'} width={40} height={40} onClick={()=>setShowFilters(true)}/>}
              </div>

            </div>
          </div>

          {showFilters && <div className="flex flex-wrap gap-x-2 justify-start lg:justify-end h-auto">
            <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="p-2 rounded-md text-black dark:text-white bg-white dark:bg-black w-20"
            >
              <option value="Cards">Cards</option>
              <option value="Table">Table</option>
            </select>
            <Image src={'/icons/rightarrow.svg'} alt={'arrow'} width={25} height={12}/>

            <select
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
                className="p-2 rounded-md text-black dark:text-white bg-white dark:bg-black w-14"
            >
              <option value="N4">N4</option>
              <option value="N5">N5</option>
              {tags
                  .filter((t) => !["N4", "N5"].includes(t))
                  .map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                  ))}
            </select>
            <Image src={'/icons/rightarrow.svg'} alt={'arrow'} width={25} height={12}/>

            <select
                value={showBookmarksOnly ? "Bookmarked" : "All"}
                onChange={(e) => setShowBookmarksOnly(e.target.value === "Bookmarked")}
                className="p-2 rounded-md text-black dark:text-white bg-white dark:bg-black w-16 max-w-auto"
            >
              <option value="All">All</option>
              <option value="Bookmarked">Bookmarked</option>
            </select>

            <Image src={'/icons/rightarrow.svg'} alt={'arrow'} width={25} height={12}/>
            <select
                value={randomizeMode}
                onChange={(e) => {
                  setRandomizeMode(e.target.value);
                  if (e.target.value !== "Custom") {
                    setCustomGroupSize("");
                  }
                }}
                className="p-2 rounded-md text-black dark:text-white bg-white dark:bg-black w-48"
            >
              <option value="None">Stop Randomization</option>
              <option value="All">Randomize All</option>
              <option value="5">Randomize in groups of 5</option>
              <option value="10">Randomize in groups of 10</option>
              <option value="15">Randomize in groups of 15</option>
              <option value="Custom">Custom Group Size</option>
            </select>
          </div>}
        </div>

        {randomizeMode === "Custom" && (
            <input
                type="text"
                placeholder="Enter group size"
                value={customGroupSize}
                onChange={onCustomGroupSizeChange}
                className="p-2 rounded-md w-36"
            />
        )}

        <div className="h-screen w-screen">
          {viewType === "Cards" ? (
              <KanjiCardView
                  kanjiList={filteredKanji}
                  onBookmarkToggle={handleBookmarkToggle}
                  sound={sound}
              />

          ) : (
              <KanjiTableView kanjiList={filteredKanji} />
          )}
        </div>
      </div>
  );
}