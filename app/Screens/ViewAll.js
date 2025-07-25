"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import VocabCard from "./components/VocabCards";
import KanjiCard from "./components/KanjiCards";
import VerbCard from "./components/VerbCards";
import GrammarCard from "./components/GrammarCards";
import TopBar from "./components/Topbar";
import Settings from "./components/Settings";
import ControlBar from "./components/ControlBar";
import LoadCard from "./components/LoadingCard";
import SettingsVocabModal from "./components/SettingsVocabModal";
import SettingsKanjiModal from "./components/SettingsKanjiModal";
import SettingsGrammarModal from "./components/SettingsGrammarModal";
import SettingsVerbModal from "./components/SettingsVerbModal";
import TargetModal from "./components/TargetModal";

import {
  fetch_vocab_data,
  update_bookmark_fetch,
  fetch_kanji_data,
  fetch_grammar_data,
  fetch_verb_data,
} from "./logic";

export default function ViewAll() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Kanji");
  const [openVocabModal, setOpenVocabModal] = useState(false);
  const [openKanjiModal, setOpenKanjiModal] = useState(false);
  const [openGrammarModal, setOpenGrammarModal] = useState(false);
  const [openVerbModal, setOpenVerbModal] = useState(false);
  const [openTargetModal, setOpenTargetModal] = useState(false);

  const [categoryState, setCategoryState] = useState({
    Vocabulary: { list: [], cache: [], index: 0 },
    Kanji: { list: [], cache: [], index: 0 },
    Grammar: { list: [], cache: [], index: 0 },
    Verbs: { list: [], cache: [], index: 0 },
  });

  const currentCategory = categoryState[selectedCategory];
  const currentList = currentCategory.list;
  const currentIndex = currentCategory.index;
  const currentItem = currentList[currentIndex];

  const handleJumpToIndex = useCallback(
    (newIndex) => {
      if (newIndex < 1 || newIndex > currentList.length) return;
      const indexToSet = newIndex - 1;

      const keyMap = {
        Vocabulary: ["vocabBookMarkChecked", "bookmarkIndex", "normalIndex"],
        Kanji: ["kanjiBookMarkChecked", "bookmarkKanjiIndex", "normalKanjiIndex"],
        Grammar: ["grammarBookMarkChecked", "bookmarkGrammarIndex", "normalGrammarIndex"],
        Verbs: ["verbBookMarkChecked", "bookmarkVerbIndex", "normalVerbIndex"],
      };

      const [checkedKey, bookmarkKey, normalKey] = keyMap[selectedCategory];
      const bookmarkChecked = localStorage.getItem(checkedKey) === "true";
      const indexKey = bookmarkChecked ? bookmarkKey : normalKey;
      localStorage.setItem(indexKey, indexToSet.toString());

      setCategoryState((prev) => ({
        ...prev,
        [selectedCategory]: {
          ...prev[selectedCategory],
          index: indexToSet,
        },
      }));
    },
    [selectedCategory, currentList.length]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const categoryMap = {
          Vocabulary: [fetch_vocab_data, "cacheVocab", "filteredVocabData", "vocabBookMarkChecked", "bookmarkIndex", "normalIndex"],
          Kanji: [fetch_kanji_data, "cacheKanji", "filteredKanjiData", "kanjiBookMarkChecked", "bookmarkKanjiIndex", "normalKanjiIndex"],
          Grammar: [fetch_grammar_data, "cacheGrammar", "filteredGrammarData", "grammarBookMarkChecked", "bookmarkGrammarIndex", "normalGrammarIndex"],
          Verbs: [fetch_verb_data, "cacheVerb", "filteredVerbData", "verbBookMarkChecked", "bookmarkVerbIndex", "normalVerbIndex"],
        };

        const [fetchFn, cacheKey, filteredKey, checkedKey, bookmarkKey, normalKey] = categoryMap[selectedCategory];
        const cacheData = await fetchFn();
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        const filtered = localStorage.getItem(filteredKey);
        const bookmarkChecked = localStorage.getItem(checkedKey) === "true";
        const data = filtered ? JSON.parse(filtered) : cacheData;

        const indexKey = bookmarkChecked ? bookmarkKey : normalKey;
        let savedIndex = parseInt(localStorage.getItem(indexKey) || "0", 10);
        if (savedIndex >= data.length) savedIndex = data.length - 1;

        setCategoryState((prev) => ({
          ...prev,
          [selectedCategory]: {
            list: data,
            cache: cacheData,
            index: savedIndex,
          },
        }));
      } catch (e) {
        console.error(`Error fetching ${selectedCategory} data:`, e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedCategory]);

  const handleSwipe = useCallback(
    (dir) => {
      const list = categoryState[selectedCategory].list;
      setCategoryState((prev) => {
        const newIndex =
          dir === "left"
            ? Math.min(prev[selectedCategory].index + 1, list.length - 1)
            : Math.max(prev[selectedCategory].index - 1, 0);

        const keyMap = {
          Vocabulary: ["vocabBookMarkChecked", "bookmarkIndex", "normalIndex"],
          Kanji: ["kanjiBookMarkChecked", "bookmarkKanjiIndex", "normalKanjiIndex"],
          Grammar: ["grammarBookMarkChecked", "bookmarkGrammarIndex", "normalGrammarIndex"],
          Verbs: ["verbBookMarkChecked", "bookmarkVerbIndex", "normalVerbIndex"],
        };

        const [checkedKey, bookmarkKey, normalKey] = keyMap[selectedCategory];
        const bookmarkChecked = localStorage.getItem(checkedKey) === "true";
        const indexKey = bookmarkChecked ? bookmarkKey : normalKey;
        localStorage.setItem(indexKey, newIndex.toString());

        return {
          ...prev,
          [selectedCategory]: {
            ...prev[selectedCategory],
            index: newIndex,
          },
        };
      });
    },
    [categoryState, selectedCategory]
  );

  const handleBookmarkToggle = useCallback(() => {
    const current = categoryState[selectedCategory];
    const list = [...current.list];
    const currentItem = { ...list[current.index] };
    currentItem.marked = !currentItem.marked;
    list[current.index] = currentItem;

    setCategoryState((prev) => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        list,
      },
    }));

    if (selectedCategory === "Vocabulary" || selectedCategory === "Kanji") {
      const cacheKey = selectedCategory === "Vocabulary" ? "cacheVocab" : "cacheKanji";
      try {
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
          const parsed = JSON.parse(cache);
          const updated = parsed.map((item) =>
            item.uid === currentItem.uid ? { ...item, marked: currentItem.marked } : item
          );
          localStorage.setItem(cacheKey, JSON.stringify(updated));
        }
      } catch (err) {
        console.error("Cache update error:", err);
      }
      update_bookmark_fetch(currentItem.marked, currentItem.uid, selectedCategory.toLowerCase());
    }
  }, [categoryState, selectedCategory]);

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

      {/* 🎯 Target Modal */}
      {openTargetModal && <TargetModal setOpenModal={setOpenTargetModal} />}

      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="w-96">
          <div className="flex justify-between items-center mb-2">
            <Settings
              onClick={() => {
                if (selectedCategory === "Vocabulary") setOpenVocabModal(true);
                else if (selectedCategory === "Kanji") setOpenKanjiModal(true);
                else if (selectedCategory === "Grammar") setOpenGrammarModal(true);
                else if (selectedCategory === "Verbs") setOpenVerbModal(true);
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setOpenTargetModal(true)}
                className="px-3 py-1 mb-2 rounded-full text-black font-medium transition bg-[#FFB8C6] dark:bg-[#FF9D7E] hover:opacity-90"
              >
                Set Target
              </button>
            </div>
          </div>

          <TopBar onSelect={setSelectedCategory} />
        </div>

        <div className="w-96">
          {loading ? (
            <LoadCard />
          ) : (
            <div className="w-96 flex items-center justify-center">
              {selectedCategory === "Vocabulary" && currentItem && (
                <VocabCard data={currentItem} onSwipe={handleSwipe} />
              )}
              {selectedCategory === "Kanji" && currentItem && (
                <KanjiCard data={currentItem} onSwipe={handleSwipe} />
              )}
              {selectedCategory === "Verbs" && currentItem && (
                <VerbCard data={currentItem} onSwipe={handleSwipe} />
              )}
              {selectedCategory === "Grammar" && currentItem && (
                <GrammarCard data={currentItem} onSwipe={handleSwipe} />
              )}
            </div>
          )}
        </div>

        <div className="w-96 px-4 mt-4">
          <ControlBar
            current={currentIndex + 1}
            total={currentList.length}
            bookmarked={currentItem?.marked}
            onBookmarkToggle={handleBookmarkToggle}
            onJumpTo={handleJumpToIndex}
          />
        </div>
      </div>
    </div>
  );
}
