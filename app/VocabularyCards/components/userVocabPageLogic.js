import { useEffect, useState, useCallback } from "react";
import { authFetch } from "@/app/middleware";

const VocabAPI = process.env.NEXT_PUBLIC_API_URL + "/flagged_vocab";
const CACHE_KEY = "cachedVocabList";
const CACHE_TIME_KEY = "VocabCacheTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export function useVocabPageLogic() {
  const [rawVocabList, setRawVocabList] = useState([]);
  const [displayVocabList, setDisplayVocabList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentVocabForTopBar, setCurrentVocabForTopBar] = useState({});
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
          const res = await authFetch(VocabAPI);
          const data = await res.json();
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          localStorage.setItem(CACHE_TIME_KEY, now.toString());
          fetchedData = data;
        } catch (e) {
          console.error("API error:", e);
        }
      }

      setRawVocabList(fetchedData);
      setDisplayVocabList(fetchedData);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSettingsApply = useCallback((processedList) => {
    setDisplayVocabList(processedList);
    setShowSettingsModal(false);
  }, []);

  const handleCurrentVocabChange = useCallback((Vocab) => {
    setCurrentVocabForTopBar(Vocab);
  }, []);

  return {
    rawVocabList,
    displayVocabList,
    isDarkMode,
    showSettingsModal,
    currentVocabForTopBar,
    handleSettingsApply,
    handleCurrentVocabChange,
    setShowSettingsModal,
    loading,
  };
}
