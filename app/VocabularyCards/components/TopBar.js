// components/TopBar.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Bookmark, BookmarkCheck, Shuffle } from "lucide-react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { authFetch } from "@/app/middleware";

const BOOKMARK_SYNC_API = process.env.NEXT_PUBLIC_API_URL + "/update_vocab_flag";
const BOOKMARK_CACHE_KEY = "bookmarkedVocab";
const BOOKMARK_SYNC_TIME_KEY = "bookmarkSyncTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export default function TopBar({
  currentVocab,
  setShowSettingsModal,
}) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]); // List of UIDs

  // Load bookmarks from local storage and optionally sync with backend
  useEffect(() => {
    const bm = JSON.parse(localStorage.getItem(BOOKMARK_CACHE_KEY) || "[]");
    setBookmarked(bm);

    const now = Date.now();
    const lastSync = parseInt(localStorage.getItem(BOOKMARK_SYNC_TIME_KEY) || "0", 10);
    if (now - lastSync > CACHE_DURATION) {
      authFetch(BOOKMARK_SYNC_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarks: bm }),
      })
        .then(() => localStorage.setItem(BOOKMARK_SYNC_TIME_KEY, now.toString()))
        .catch(console.error);
    }
  }, []);

  // Toggle bookmark for the current vocab item
  const toggleBookmark = useCallback(() => {
    const uid = currentVocab?.uid;
    if (typeof uid === "undefined") {
      console.warn("UID not found — cannot toggle bookmark.");
      return;
    }

    setBookmarked(prev => {
      let updated;
      if (prev.includes(uid)) {
        updated = prev.filter(id => id !== uid);
      } else {
        updated = [...prev, uid];
      }

      localStorage.setItem(BOOKMARK_CACHE_KEY, JSON.stringify(updated));

      // Send API call
      authFetch(BOOKMARK_SYNC_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation_type: !prev.includes(uid), // true = add, false = remove
          t_id: uid,
        }),
      }).catch(console.error);

      return updated;
    });
  }, [currentVocab]);

  // Show bookmarked if either it's marked in backend or locally toggled
  const isCurrentVocabBookmarked = currentVocab?.uid
    ? bookmarked.includes(currentVocab.uid) || currentVocab.marked === true
    : false;

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
            {isCurrentVocabBookmarked
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
