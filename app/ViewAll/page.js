"use client";

import { useEffect, useState, useCallback } from "react";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import Navbar from "../common_components/Navbar";
import VocabCard from "./components/VocabCards";
import TopBar from "./components/Topbar";
import Settings from "./components/Settings";
import ControlBar from "./components/ControlBar";
import LoadCard from "./components/LoadingCard";

import { fetch_vocab_data, update_bookmark_fetch } from "./logic";
import SettingsVocabModal from "./components/SettingsVocabModal";

export default function ViewAll() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Vocabulary");
  const [vocabList, setVocabList] = useState([]);
  const [vocabCache, setVocabCache] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openVocabModal, setOpenVocabModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      if (selectedCategory === "Vocabulary") {
        try {
          const cacheData = await fetch_vocab_data(); // fetch_vocab_data already stores cache
          localStorage.setItem("cacheVocab", JSON.stringify(cacheData));
          setVocabCache(cacheData);

          const filtered = localStorage.getItem("filteredVocabData");
          const bookmarkChecked =
            localStorage.getItem("vocabBookMarkChecked") === "true";

          let vocabData = cacheData;
          if (filtered) {
            const parsed = JSON.parse(filtered);
            vocabData = parsed;
          }

          setVocabList(vocabData);

          const indexKey = bookmarkChecked ? "bookmarkIndex" : "normalIndex";
          let savedIndex = parseInt(localStorage.getItem(indexKey) || "0", 10);
          if (savedIndex >= vocabData.length) savedIndex = vocabData.length - 1;

          setCurrentIndex(savedIndex);
        } catch (e) {
          console.error("Error fetching vocab:", e);
        }
        setLoading(false);
      } else {
        setVocabList([]); // Placeholder
        setLoading(true);
      }
    };
    load();
  }, [selectedCategory]);

  const handleSwipe = useCallback(
    (dir) => {
      setCurrentIndex((prevIndex) => {
        let next = dir === "left" ? prevIndex + 1 : prevIndex - 1;
        if (next < 0 || next >= vocabList.length) return prevIndex;

        const bookmarkChecked =
          localStorage.getItem("vocabBookMarkChecked") === "true";
        const indexKey = bookmarkChecked ? "bookmarkIndex" : "normalIndex";
        localStorage.setItem(indexKey, next.toString());

        return next;
      });
    },
    [vocabList.length]
  );

  const handleBookmarkToggle = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= vocabList.length) return;

    const updatedList = [...vocabList];
    const currentItem = { ...updatedList[currentIndex] };
    const newMarkedState = !currentItem.marked;

    // 1. Update state
    currentItem.marked = newMarkedState;
    updatedList[currentIndex] = currentItem;
    setVocabList(updatedList);

    // 2. Replace vocabCache in localStorage
    try {
      const cache = localStorage.getItem("cacheVocab");
      if (cache) {
        const parsedCache = JSON.parse(cache);

        // Fully replace the entire item
        const updatedCache = parsedCache.map((item) =>
          item.uid === currentItem.uid
            ? { ...item, marked: newMarkedState }
            : item
        );

        // 🔥 Delete then rewrite (clean rewrite for freshness)
        localStorage.removeItem("cacheVocab");
        localStorage.setItem("cacheVocab", JSON.stringify(updatedCache));

        console.log(
          "✅ Rewritten vocabCache:",
          updatedCache.find((i) => i.uid === currentItem.uid)
        );
      } else {
        console.warn("⚠️ vocabCache not found.");
      }
    } catch (err) {
      console.error("❌ Failed to update vocabCache:", err);
    }

    // 3. Send to API
    update_bookmark_fetch(newMarkedState, currentItem.uid, "vocab");
  }, [currentIndex, vocabList]);

  return (
    <div className="mb-8">
      <header>
        <div className="dark:hidden">
          <CherryBlossomSnowfall isDarkMode={false} />
        </div>
        <div className="hidden dark:block">
          <CherryBlossomSnowfall isDarkMode={true} />
        </div>
      </header>

      {/* MODALS */}
      {openVocabModal && (
        <SettingsVocabModal
          setOpenModal={setOpenVocabModal}
          setFilteredData={setVocabList}
          setBookmark={(value) => {
            localStorage.setItem(
              "vocabBookMarkChecked",
              value ? "true" : "false"
            );

            const updatedList = value
              ? vocabCache.filter((item) => item.marked)
              : vocabCache;

            setVocabList(updatedList);

            const indexKey = value ? "bookmarkIndex" : "normalIndex";
            let savedIndex = parseInt(
              localStorage.getItem(indexKey) || "0",
              10
            );
            if (savedIndex >= updatedList.length)
              savedIndex = updatedList.length - 1;

            setCurrentIndex(savedIndex);
          }}
        />
      )}

      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="w-96">
          <Settings onClick={() => setOpenVocabModal(true)} />
          <TopBar onSelect={setSelectedCategory} />
        </div>

        <div className="w-96">
          {loading ? (
            <LoadCard />
          ) : (
            <div className="w-96 flex items-center justify-center">
              <VocabCard data={vocabList[currentIndex]} onSwipe={handleSwipe} />
            </div>
          )}
        </div>

        <div className="w-96 px-4 mt-4">
          <ControlBar
            current={currentIndex + 1}
            total={vocabList.length}
            bookmarked={vocabList[currentIndex]?.marked}
            onBookmarkToggle={handleBookmarkToggle}
          />
        </div>
      </div>

      <footer>
        <Navbar />
      </footer>
    </div>
  );
}
