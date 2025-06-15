import { useEffect, useState, useCallback } from "react";
import { authFetch } from "@/app/middleware";

const KanjiAPI = process.env.NEXT_PUBLIC_API_URL + "/flagged_kanjis";
const CACHE_KEY = "cachedKanjiList";
const CACHE_TIME_KEY = "kanjiCacheTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export function useKanjiPageLogic() {
  const [rawKanjiList, setRawKanjiList] = useState([]);
  const [displayKanjiList, setDisplayKanjiList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentKanjiForTopBar, setCurrentKanjiForTopBar] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    const loadData = async () => {
      const now = Date.now();
      const cacheTime = parseInt(localStorage.getItem(CACHE_TIME_KEY) || "0", 10);
      const saved = localStorage.getItem(CACHE_KEY);

      let fetchedData = [];

      if (saved && now - cacheTime < CACHE_DURATION) {
        fetchedData = JSON.parse(saved);
      } else {
        try {
          const res = await authFetch(KanjiAPI);
          const data = await res.json();
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
          fetchedData = data;
        } catch (e) {
          console.error("API error:", e);
        }
      }

      setRawKanjiList(fetchedData);
      setDisplayKanjiList(fetchedData);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSettingsApply = useCallback((processedList) => {
    setDisplayKanjiList(processedList);
    setShowSettingsModal(false);
  }, []);

  const handleCurrentKanjiChange = useCallback((kanji) => {
    setCurrentKanjiForTopBar(kanji);
  }, []);

  return {
    rawKanjiList,
    displayKanjiList,
    isDarkMode,
    showSettingsModal,
    currentKanjiForTopBar,
    handleSettingsApply,
    handleCurrentKanjiChange,
    setShowSettingsModal,
    loading,
  };
}
