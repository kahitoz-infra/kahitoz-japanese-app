"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Bookmark, BookmarkCheck, Shuffle } from "lucide-react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

export default function TopBar({
  currentVocab,
  handleToggleBookmark, // ✅ passed in from hook
  setShowSettingsModal,
}) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
    if (currentVocab?.marked !== undefined) {
      setIsMarked(currentVocab.marked);
    }
  }, [currentVocab]);

  const toggleBookmark = () => {
    if (!currentVocab?.uid) return;
    handleToggleBookmark(currentVocab.uid); // ✅ use the passed-in function
  };

  return (
    <div className="fixed top-1 left-0 flex gap-3 z-10">
      <div className="flex flex-row w-screen justify-between items-center px-2 py-1">
        <div>
          <Link href="/Learn">{"< BACK"}</Link>
        </div>

        <div className="flex gap-x-2">
          <button onClick={() => setIsSoundOn(s => !s)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
            {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
          </button>

          <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
            {isMarked
              ? <BookmarkCheck className="text-black" />
              : <Bookmark className="text-black" />}
          </button>

          <button onClick={() => setShowSettingsModal(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <Shuffle className="text-black" />
          </button>

          <button onClick={() => setShowSettingsModal(true)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <Cog6ToothIcon className="text-black w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
