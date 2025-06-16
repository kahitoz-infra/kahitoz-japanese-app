"use client";

import { Bookmark, BookmarkCheck, Shuffle } from "lucide-react";
import React from "react";

export default function ControlBar({
  current,
  total,
  bookmarked,
  onBookmarkToggle,
}) {
  return (
    <div className="flex w-full items-center justify-center border border-orange-500 rounded-xl dark:bg-[#2F2F2F]">
      <ul className="flex items-center justify-between gap-x-4 px-2 py-2 w-full">
        <li>
          <button className="p-2 rounded-full bg-gray-300 dark:bg-white">
            <Shuffle className="text-black" />
          </button>
        </li>
        <li>
          <strong>{current}</strong>/<strong>{total}</strong>
        </li>
        <li>
          <button onClick={onBookmarkToggle}>
            {bookmarked ? (
              <BookmarkCheck className="text-black dark:text-white" />
            ) : (
              <Bookmark className="text-black dark:text-white" />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
