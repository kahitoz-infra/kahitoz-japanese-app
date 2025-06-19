'use client';

import { useState } from 'react';
import CustomButton from '@/app/common_components/CustomButton';

const jlptLevels = ['N5', 'N4', 'N3'];

const levelRanges = {
  N5: ['All Vocab', '1–100', '100–200', '200–300', '300–400', '400–500', '500–556'],
  N4: ['All Vocab', '1–100', '100–200', '200–300', '300–400', '400–500'],
  N3: ['All Vocab', '1–100', '100–200'], // Add more later
};

export default function JLPTLevelSelector() {
  const [modes, setModes] = useState([]); // Multi-select: ['Vocabulary', 'Kanji']
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState({});

  const toggleMode = (mode) => {
    setModes((prev) =>
      prev.includes(mode)
        ? prev.filter((m) => m !== mode)
        : [...prev, mode]
    );

    // Optional: Reset level/range selection when all modes are cleared
    if (modes.length === 1 && modes.includes(mode)) {
      setSelectedLevels([]);
      setSelectedRanges({});
    }
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) => {
      const isSelected = prev.includes(level);
      const updated = isSelected ? prev.filter((l) => l !== level) : [...prev, level];

      // If deselected, remove its selected ranges
      if (isSelected) {
        const updatedRanges = { ...selectedRanges };
        delete updatedRanges[level];
        setSelectedRanges(updatedRanges);
      }

      return updated;
    });
  };

  const toggleRange = (level, range) => {
    setSelectedRanges((prev) => {
      const current = prev[level] || [];
      const updated = current.includes(range)
        ? current.filter((r) => r !== range)
        : [...current, range];
      return { ...prev, [level]: updated };
    });
  };

  const hasValidSelection =
    modes.length > 0 &&
    selectedLevels.length > 0 &&
    Object.values(selectedRanges).some((ranges) => ranges.length > 0);

  // Convert modes to a comma-separated string for query param
  const modeQuery = modes.join(',');

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Mode Selector */}
      <h2 className="text-xl md:text-2xl font-semibold text-center">
            Please choose your Quiz Type
          </h2>
      <div className="flex gap-4 flex-wrap justify-center">
        {['Kanji', 'Vocabulary'].map((option) => {
          const isSelected = modes.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggleMode(option)}
              className={`
                px-4 py-2 rounded-md border text-sm font-semibold transition-colors duration-200
                ${
                  isSelected
                    ? 'bg-[#FFB8C6] dark:bg-[#FF9D7E]'
                    : 'bg-[#FAF9F6] dark:bg-white'
                }
                text-black dark:border-gray-600
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* JLPT Level and Range Selection (only if at least one mode selected) */}
      {modes.length > 0 && (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-center">
            Please select the JLPT Levels
          </h2>

          {/* JLPT Level Buttons */}
          <div className="flex gap-4 flex-wrap justify-center">
            {jlptLevels.map((level) => {
              const isSelected = selectedLevels.includes(level);

              return (
                <button
                  key={level}
                  onClick={() => toggleLevel(level)}
                  className={`
                    w-16 h-16 flex items-center justify-center rounded-md text-lg font-bold border transition-colors duration-200
                    ${
                      isSelected
                        ? 'bg-[#FFB8C6] dark:bg-[#FF9D7E]'
                        : 'bg-[#FAF9F6] dark:bg-white'
                    }
                    text-black dark:border-gray-600
                  `}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Ranges for Selected Levels */}
          <div className="flex flex-col gap-4 w-full max-w-4xl px-4">
            {selectedLevels.map((level) => (
              <div key={level} className="flex flex-col gap-2">
                <span className="font-semibold text-lg">{level}:</span>
                <div className="flex flex-wrap gap-2">
                  {levelRanges[level]?.map((range) => {
                    const isActive = selectedRanges[level]?.includes(range);
                    return (
                      <button
                        key={range}
                        onClick={() => toggleRange(level, range)}
                        className={`
                          px-3 py-1 rounded-md border text-sm font-medium transition-colors duration-200
                          ${
                            isActive
                              ? 'bg-[#FFB8C6] dark:bg-[#FF9D7E]'
                              : 'bg-[#FAF9F6] dark:bg-white'
                          }
                          text-black dark:border-gray-600
                        `}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Custom Button */}
      <div className="">
        <CustomButton
          text="Start Quiz"
          href={hasValidSelection ? `/Quiz?mode=${modeQuery}` : "#"}
          disabled={!hasValidSelection}
        />
      </div>
    </div>
  );
}
