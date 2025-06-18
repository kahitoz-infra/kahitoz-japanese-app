"use client";

import { useEffect, useState, useCallback } from "react";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import Navbar from "../common_components/Navbar";
import VocabCard from "./components/VocabCards";
import KanjiCard from "./components/KanjiCards";
import TopBar from "./components/Topbar";
import Settings from "./components/Settings";
import ControlBar from "./components/ControlBar";
import LoadCard from "./components/LoadingCard";
import SettingsVocabModal from "./components/SettingsVocabModal";
import SettingsKanjiModal from "./components/SettingsKanjiModal";

import {
  fetch_vocab_data,
  update_bookmark_fetch,
  fetch_kanji_data,
} from "./logic";

export default function ViewAll() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Kanji");
  const [openVocabModal, setOpenVocabModal] = useState(false);
  const [openKanjiModal, setOpenKanjiModal] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        if (selectedCategory === "Vocabulary") {
          const cacheData = await fetch_vocab_data();
          localStorage.setItem("cacheVocab", JSON.stringify(cacheData));

          const filtered = localStorage.getItem("filteredVocabData");
          const bookmarkChecked =
            localStorage.getItem("vocabBookMarkChecked") === "true";

          let vocabData = filtered ? JSON.parse(filtered) : cacheData;

          const indexKey = bookmarkChecked ? "bookmarkIndex" : "normalIndex";
          let savedIndex = parseInt(localStorage.getItem(indexKey) || "0", 10);
          if (savedIndex >= vocabData.length) savedIndex = vocabData.length - 1;

          setCategoryState((prev) => ({
            ...prev,
            Vocabulary: {
              list: vocabData,
              cache: cacheData,
              index: savedIndex,
            },
          }));
          setLoading(false);
        } else if (selectedCategory === "Kanji") {
          const cacheData = await fetch_kanji_data();
          localStorage.setItem("cacheKanji", JSON.stringify(cacheData));

          const filtered = localStorage.getItem("filteredKanjiData");
          const bookmarkChecked =
            localStorage.getItem("kanjiBookMarkChecked") === "true";

          let kanjiData = filtered ? JSON.parse(filtered) : cacheData;

          const indexKey = bookmarkChecked
            ? "bookmarkKanjiIndex"
            : "normalKanjiIndex";
          let savedIndex = parseInt(localStorage.getItem(indexKey) || "0", 10);
          if (savedIndex >= kanjiData.length) savedIndex = kanjiData.length - 1;

          setCategoryState((prev) => ({
            ...prev,
            Kanji: {
              list: kanjiData,
              cache: cacheData,
              index: savedIndex,
            },
          }));
          setLoading(false);
        } else if (selectedCategory === "Grammar") {
          // TODO: Implement Grammar fetch logic
          setCategoryState((prev) => ({
            ...prev,
            Grammar: {
              list: [], // replace with fetched grammar list
              cache: [],
              index: 0,
            },
          }));
        } else if (selectedCategory === "Verb") {
          // TODO: Implement Verb fetch logic
          setCategoryState((prev) => ({
            ...prev,
            Verb: {
              list: [], // replace with fetched verb list
              cache: [],
              index: 0,
            },
          }));
        } else {
          setLoading(true);
        }
      } catch (e) {
        console.error(`Error fetching ${selectedCategory} data:`, e);
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

        if (selectedCategory === "Vocabulary") {
          const bookmarkChecked =
            localStorage.getItem("vocabBookMarkChecked") === "true";
          const indexKey = bookmarkChecked ? "bookmarkIndex" : "normalIndex";
          localStorage.setItem(indexKey, newIndex.toString());
        } else if (selectedCategory === "Kanji") {
          const bookmarkChecked =
            localStorage.getItem("kanjiBookMarkChecked") === "true";
          const indexKey = bookmarkChecked
            ? "bookmarkKanjiIndex"
            : "normalKanjiIndex";
          localStorage.setItem(indexKey, newIndex.toString());
        }

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

    if (selectedCategory === "Vocabulary") {
      try {
        const cache = localStorage.getItem("cacheVocab");
        if (cache) {
          const parsedCache = JSON.parse(cache);
          const updatedCache = parsedCache.map((item) =>
            item.uid === currentItem.uid
              ? { ...item, marked: currentItem.marked }
              : item
          );
          localStorage.setItem("cacheVocab", JSON.stringify(updatedCache));
        }
      } catch (err) {
        console.error("Error updating cache:", err);
      }

      update_bookmark_fetch(currentItem.marked, currentItem.uid, "vocab");
    } else if (selectedCategory === "Kanji") {
      try {
        const cache = localStorage.getItem("cacheKanji");
        if (cache) {
          const parsedCache = JSON.parse(cache);
          const updatedCache = parsedCache.map((item) =>
            item.uid === currentItem.uid
              ? { ...item, marked: currentItem.marked }
              : item
          );
          localStorage.setItem("cacheKanji", JSON.stringify(updatedCache));
        }
      } catch (err) {
        console.error("Error updating cache:", err);
      }

      update_bookmark_fetch(currentItem.marked, currentItem.uid, "kanji");
    }

    // TODO: Add bookmark API update for Kanji, Grammar, Verb
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

      {openVocabModal && selectedCategory === "Vocabulary" && (
        <SettingsVocabModal
          setOpenModal={setOpenVocabModal}
          setFilteredData={(updated) => {
            setCategoryState((prev) => ({
              ...prev,
              Vocabulary: {
                ...prev.Vocabulary,
                list: updated,
              },
            }));

            const bookmarkChecked =
              localStorage.getItem("vocabBookMarkChecked") === "true";
            const indexKey = bookmarkChecked ? "bookmarkIndex" : "normalIndex";
            let savedIndex = parseInt(
              localStorage.getItem(indexKey) || "0",
              10
            );
            if (savedIndex >= updated.length) savedIndex = updated.length - 1;

            setCategoryState((prev) => ({
              ...prev,
              Vocabulary: {
                ...prev.Vocabulary,
                index: savedIndex,
              },
            }));
          }}
          setBookmark={(value) => {
            localStorage.setItem(
              "vocabBookMarkChecked",
              value ? "true" : "false"
            );
            const updatedList = value
              ? categoryState.Vocabulary.cache.filter((item) => item.marked)
              : categoryState.Vocabulary.cache;

            setCategoryState((prev) => ({
              ...prev,
              Vocabulary: {
                ...prev.Vocabulary,
                list: updatedList,
                index: 0,
              },
            }));
          }}
        />
      )}

      {openKanjiModal && selectedCategory === "Kanji" && (
        <SettingsKanjiModal
          setOpenModal={setOpenKanjiModal}
          setFilteredData={(updated) => {
            setCategoryState((prev) => ({
              ...prev,
              Kanji: {
                ...prev.Kanji,
                list: updated,
              },
            }));

            const bookmarkChecked =
              localStorage.getItem("kanjiBookMarkChecked") === "true";
            const indexKey = bookmarkChecked
              ? "bookmarkKanjiIndex"
              : "normalKanjiIndex";
            let savedIndex = parseInt(
              localStorage.getItem(indexKey) || "0",
              10
            );
            if (savedIndex >= updated.length) savedIndex = updated.length - 1;

            setCategoryState((prev) => ({
              ...prev,
              Kanji: {
                ...prev.Kanji,
                index: savedIndex,
              },
            }));
          }}
          setBookmark={(value) => {
            localStorage.setItem(
              "vocabBookMarkChecked",
              value ? "true" : "false"
            );
            const updatedList = value
              ? categoryState.Kanji.cache.filter((item) => item.marked)
              : categoryState.Kanji.cache;

            setCategoryState((prev) => ({
              ...prev,
              Kanji: {
                ...prev.Kanji,
                list: updatedList,
                index: 0,
              },
            }));
          }}
        />
      )}

      <div className="flex flex-col w-full h-screen items-center justify-center">
        <div className="w-96">
          <Settings
            onClick={() => {
              if (selectedCategory === "Vocabulary") {
                setOpenVocabModal(true);
              } else if (selectedCategory === "Kanji") {
                setOpenKanjiModal(true);
              }
              // TODO: Add modals for Kanji, Grammar, Verb
            }}
          />
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
              {/* TODO: Add KanjiCard, GrammarCard, VerbCard when ready */}
            </div>
          )}
        </div>

        <div className="w-96 px-4 mt-4">
          <ControlBar
            current={currentIndex + 1}
            total={currentList.length}
            bookmarked={currentItem?.marked}
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
