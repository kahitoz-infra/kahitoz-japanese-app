"use client";
import { useState, useEffect } from "react";

export default function TopBar({ onSelect }) {
  const items = ["Kanji", "Vocabulary", "Grammar", "Verbs"];
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPreference = localStorage.getItem("TopBarPreference");
      let initialIndex = null;

      if (storedPreference) {
        initialIndex = items.indexOf(storedPreference);
        if (initialIndex === -1) {
          initialIndex = items.indexOf("Kanji");
          localStorage.setItem("TopBarPreference", "Kanji");
        }
      } else {
        initialIndex = items.indexOf("Kanji");
        localStorage.setItem("TopBarPreference", "kanji");
      }
      setActiveIndex(initialIndex);
      if (onSelect) onSelect(items[initialIndex]);
    }
  }, []);

  const handleItemClick = (index) => {
    setActiveIndex(index);
    if (typeof window !== "undefined") {
      localStorage.setItem("TopBarPreference", items[index]);
    }
    if (onSelect) onSelect(items[index]);
  };

  return (
    <div className="flex items-center justify-center">
      <ul className="flex gap-x-4  px-4 py-2 rounded-xl font-bold bg-[#f5f5f5] dark:bg-[#2F2F2F]">
        {items.map((item, index) => (
          <li
            key={index}
            className={`px-2 py-1 rounded-2xl cursor-pointer ${
              activeIndex === index
                ? "bg-[#FF6E8A] dark:bg-[#FF9270] font-bold text-white dark:text-black"
                : ""
            }`}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
