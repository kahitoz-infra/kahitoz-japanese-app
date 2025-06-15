import { useEffect, useState, useCallback } from "react";
import { authFetch } from "@/app/middleware";

const VocabAPI = process.env.NEXT_PUBLIC_API_URL + "/flagged_vocab";
const BOOKMARK_SYNC_API = process.env.NEXT_PUBLIC_API_URL + "/update_vocab_flag";
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
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false); // <-- NEW

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

  const applyFilters = useCallback((list) => {
    let updated = [...list];
    if (showBookmarkedOnly) {
      updated = updated.filter((item) => item.marked);
    }
    return updated;
  }, [showBookmarkedOnly]);

  const handleSettingsApply = useCallback((processedList, settings = {}) => {
    setDisplayVocabList(processedList);
    setShowBookmarkedOnly(settings.showBookmarkedOnly ?? false);
    setShowSettingsModal(false);
  }, []);

  const handleCurrentVocabChange = useCallback((vocab) => {
    setCurrentVocabForTopBar(vocab);
  }, []);

  // 🔧 New: Toggle bookmark + update state + reapply filter
  const handleToggleBookmark = useCallback((uid) => {
    let newMarked = false;

    const updatedRaw = rawVocabList.map((item) => {
      if (item.uid === uid) {
        newMarked = !item.marked;
        return { ...item, marked: newMarked };
      }
      return item;
    });

    setRawVocabList(updatedRaw);
    const updatedDisplay = applyFilters(updatedRaw);
    setDisplayVocabList(updatedDisplay);

    // Also update the top bar vocab
    setCurrentVocabForTopBar((prev) =>
      prev?.uid === uid ? { ...prev, marked: newMarked } : prev
    );

    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedRaw));

    authFetch(BOOKMARK_SYNC_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation_type: newMarked,
        t_id: uid,
      }),
    }).catch(console.error);
  }, [rawVocabList, applyFilters]);

  return {
    rawVocabList,
    displayVocabList,
    isDarkMode,
    showSettingsModal,
    currentVocabForTopBar,
    handleSettingsApply,
    handleCurrentVocabChange,
    handleToggleBookmark, // <-- EXPORT THIS
    setShowSettingsModal,
    loading,
  };
}
