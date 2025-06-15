"use client";

import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import TopBar from "./components/TopBar";
import SettingsModal from "./components/SettingsModal";
import KanjiCard from "./components/KanjiCard";
import { useKanjiPageLogic } from "./components/useKanjiPageLogic";

export default function KanjiCardsPage() {
  const {
    rawKanjiList,
    displayKanjiList,
    isDarkMode,
    showSettingsModal,
    currentKanjiForTopBar,
    handleSettingsApply,
    handleCurrentKanjiChange,
    setShowSettingsModal,
    loading,
  } = useKanjiPageLogic();


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-[#292b2d] dark:text-gray-200">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      <TopBar
        currentKanji={currentKanjiForTopBar}
        setShowSettingsModal={setShowSettingsModal}
      />

      {loading ? (
        <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#292b2d]" : "bg-white"
        }`}
      >
        <div
          className="w-16 h-16 border-4 border-dashed rounded-full animate-spin"
          style={{
            borderColor: isDarkMode
              ? "#FF6600 transparent #FF6600 transparent"
              : "#de3163 transparent #de3163 transparent",
          }}
        />
      </div>
      ) : (
        <KanjiCard
          kanjiList={displayKanjiList}
          onCurrentKanjiChange={handleCurrentKanjiChange}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        rawKanjiList={rawKanjiList}
        onApply={handleSettingsApply}
      />
    </div>
  );
}
