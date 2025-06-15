"use client";

import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import TopBar from "./components/TopBar";
import SettingsModal from "./components/SettingsModal";
import VocabCard from "./components/VocabCard";
import { useVocabPageLogic } from "./components/userVocabPageLogic";

export default function VocabCardsPage() {
  const {
    rawVocabList,
    displayVocabList,
    isDarkMode,
    showSettingsModal,
    currentVocabForTopBar,
    handleSettingsApply,
    handleCurrentVocabChange,
    setShowSettingsModal,
    loading,
  } = useVocabPageLogic();


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-[#292b2d] dark:text-gray-200">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      <TopBar
        currentVocab={currentVocabForTopBar}
        setShowSettingsModal={setShowSettingsModal}
      />

      {loading ? (
        <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-[#292b2d]" : ""
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
        <VocabCard
          vocabList={displayVocabList}
          onCurrentVocabChange={handleCurrentVocabChange}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        rawVocabList={rawVocabList}
        onApply={handleSettingsApply}
      />
    </div>
  );
}
