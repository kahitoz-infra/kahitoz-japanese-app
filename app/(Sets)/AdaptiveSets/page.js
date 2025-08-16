"use client";

import AdaptiveQuizSets from "@/app/common_components/AdaptiveQuizSets";
import CherryBlossomSnowfall from "@/app/common_components/CherryBlossomSnowfall";
import CircularButton from "@/app/common_components/CircularButton";
import { useState, useEffect } from "react";

function AdaptiveSets() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);

    const listener = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", listener);

    return () => {
      darkModeQuery.removeEventListener("change", listener);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background effect */}
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      {/* Content */}
      <div className="relative z-10">
        <AdaptiveQuizSets />
      </div>

      {/* Home button fixed at bottom-right */}
      <div className="fixed bottom-0 right-0 px-4 py-4 z-20">
        <CircularButton href="/" icon="home" />
      </div>
    </div>
  );
}

export default AdaptiveSets;
