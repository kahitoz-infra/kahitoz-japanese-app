// components/TopBar.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Volume2, VolumeX, Bookmark, BookmarkCheck, Shuffle } from "lucide-react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { authFetch } from "@/app/middleware";

const BOOKMARK_SYNC_API = process.env.NEXT_PUBLIC_API_URL + "/update_flag";
const BOOKMARK_CACHE_KEY = "bookmarkedKanji";
const BOOKMARK_SYNC_TIME_KEY = "bookmarkSyncTimestamp";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12h

export default function TopBar({
  currentKanji,
  setShowSettingsModal,
}) {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState([]); // List of UIDs
  const [localToggles, setLocalToggles] = useState(new Set());

  // Load bookmarks from local storage
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

  // Toggle bookmark
  const toggleBookmark = useCallback(() => {
    const uid = currentKanji?.uid;
    if (uid === undefined) return;

    // Update local toggle override
    setLocalToggles(prev => {
      const newToggles = new Set(prev);
      if (newToggles.has(uid)) {
        newToggles.delete(uid);
      } else {
        newToggles.add(uid);
      }
      return newToggles;
    });

    // Send API call with correct flag
    authFetch(BOOKMARK_SYNC_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation_type: !(currentKanji.marked ?? false),
        t_id: uid,
      }),
    }).catch(console.error);
  }, [currentKanji]);

  // Derive current bookmark state (with local override if toggled)
  const isCurrentKanjiBookmarked = (() => {
    const uid = currentKanji?.uid;
    if (!uid) return false;
    const localToggle = localToggles.has(uid);
    return localToggle ? !currentKanji.marked : currentKanji.marked;
  })();

  return (
    <div className="fixed top-1 left-0 flex gap-3 z-10">


      <div className="flex flex-row w-screen justify-between items-center px-2 py-1">

        <div>
          <Link href="/Learn" >{"< BACK"}</Link>
        </div>


        <div className="flex gap-x-2"> 

          <button onClick={() => setIsSoundOn(s => !s)} className="p-2 rounded-full bg-gray-300 dark:bg-white">
            {isSoundOn ? <Volume2 className="text-black" /> : <VolumeX className="text-black" />}
          </button>

          <button onClick={toggleBookmark} className="p-2 rounded-full bg-gray-300 dark:bg-white">
            {isCurrentKanjiBookmarked
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
