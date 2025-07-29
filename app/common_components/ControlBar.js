import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Shuffle } from "lucide-react";

export default function ControlBar({
  current,
  total,
  bookmarked,
  onBookmarkToggle,
  onJumpTo,
}) {
  const [isShuffled, setIsShuffled] = useState(false);
  const [inputValue, setInputValue] = useState(current.toString());

  // ✅ Sync inputValue with current prop
  useEffect(() => {
    setInputValue(current.toString());
  }, [current]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const newIndex = parseInt(inputValue, 10);
    if (!isNaN(newIndex) && newIndex >= 1 && newIndex <= total) {
      onJumpTo(newIndex);
    } else {
      setInputValue(current.toString()); // Reset to current if invalid
    }
  };

  return (
    <div className="flex w-full items-center justify-center border border-[#FF5274] dark:border-orange-500 fill-white dark:fill-[#333333] rounded-xl dark:bg-[#2F2F2F] opacity-100">
      <ul className="flex items-center justify-between gap-x-4 px-2 py-2 w-full">
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
                  ? "text-black"
                  : "text-black dark:text-white"
              }`}
            />
          </button>
        </li>

        <li className="flex items-center gap-1 text-black dark:text-white">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-10 text-center bg-transparent border-b border-gray-400 dark:border-gray-500 focus:outline-none"
          />
          / <strong>{total}</strong>
        </li>

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
