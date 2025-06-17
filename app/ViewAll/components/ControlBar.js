"use client";

import { Bookmark, BookmarkCheck, Shuffle } from "lucide-react";
import React, { useState } from "react";

export default function ControlBar({
  current,
  total,
  bookmarked,
  onBookmarkToggle,
}) {
  const [isShuffled, setIsShuffled] = useState(false);

  return (
    <div className="flex w-full items-center justify-center border border-[#FF5274] dark:border-orange-500 fill-white dark:fill-[#333333] rounded-xl dark:bg-[#2F2F2F] opacity-100">
      <ul className="flex items-center justify-between gap-x-4 px-2 py-2 w-full">
        {/* Shuffle Toggle Button */}
        <li>
          <button
            onClick={() => setIsShuffled((prev) => !prev)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isShuffled ? "bg-gray-200 dark:bg-white" : ""
            }`}
            title="Shuffle"
          >
            <Shuffle
              size={25}
              className={`${
                isShuffled
                  ? "text-black dark: text-black"
                  : "text-black dark:text-white"
              }`}
            />
          </button>
        </li>

        {/* Current / Total Count */}
        <li>
          <strong>{current}</strong>/<strong>{total}</strong>
        </li>

        {/* Bookmark Toggle */}
        <li className="mt-2">
          <button onClick={onBookmarkToggle} title="Bookmark">
            {bookmarked ? (
              <BookmarkCheck size={28} className="text-black dark:text-white" />
            ) : (
              <Bookmark size={28} className="text-black dark:text-white" />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
