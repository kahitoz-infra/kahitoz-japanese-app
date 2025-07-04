"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/app/middleware";
import QuizTypeJS from "./QuizType";
import QuizModal from "./QuizModal";

const quizTypes = ["Vocab", "Kanji"];
const info_api = process.env.NEXT_PUBLIC_API_URL + "/level_info";

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function buildRangesFromUIDs(start, end, chunkSize = 100) {
  const ranges = [];
  let index = 1;
  let currentStartUID = start;

  while (currentStartUID <= end) {
    const currentEndUID = Math.min(currentStartUID + chunkSize - 1, end);
    ranges.push({
      label: `${index}–${index + (currentEndUID - currentStartUID)}`,
      uidStart: currentStartUID,
      uidEnd: currentEndUID,
    });

    index += currentEndUID - currentStartUID + 1;
    currentStartUID = currentEndUID + 1;
  }

  return ranges;
}

export default function JLPTLevelSelector({ userType }) {
  const [selectedType, setSelectedType] = useState("");
  const [levelInfo, setLevelInfo] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [rangesByLevel, setRangesByLevel] = useState({});
  const [selectedRanges, setSelectedRanges] = useState({});
  const [chunkSize, setChunkSize] = useState("100");
  const [warning, setWarning] = useState("");
  const [QuestionType, SetSelectedQuestionType] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuestionTypeSubmit = (selected) => {
    console.log("Selected Question Types:", selected);
    SetSelectedQuestionType(selected);
  };

  useEffect(() => {
    const fetchLevelInfo = async () => {
      if (!selectedType) return;

      const key = `level_info_${selectedType.toLowerCase()}`;
      const cached = localStorage.getItem(key);
      const cachedTime = localStorage.getItem(`${key}_timestamp`);

      if (
        cached &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < CACHE_EXPIRY
      ) {
        setLevelInfo(JSON.parse(cached));
        return;
      }

      try {
        const res = await authFetch(
          `${info_api}?type=${selectedType.toLowerCase()}`
        );
        const data = await res.json();
        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(`${key}_timestamp`, Date.now().toString());
        setLevelInfo(data);
      } catch (err) {
        console.error("API fetch failed:", err);
      }
    };

    fetchLevelInfo();
  }, [selectedType]);

  useEffect(() => {
    if (!levelInfo.length) return;

    const size = parseInt(chunkSize);
    if (isNaN(size) || size < 5) {
      setRangesByLevel({}); // Clear ranges if chunkSize is invalid
      return;
    }

    const mapped = {};
    for (const [level, start, end] of levelInfo) {
      mapped[level] = buildRangesFromUIDs(start, end, size);
    }
    setRangesByLevel(mapped);
  }, [levelInfo, chunkSize]);

  const toggleType = (type) => {
    if (type === selectedType) {
      setSelectedType("");
      setLevelInfo([]);
      setRangesByLevel({});
      setSelectedLevels([]);
      setSelectedRanges({});
    } else {
      setSelectedType(type);
      setSelectedLevels([]);
      setSelectedRanges({});
    }
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) => {
      const updated = prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level];

      if (prev.includes(level)) {
        const updatedRanges = { ...selectedRanges };
        delete updatedRanges[level];
        setSelectedRanges(updatedRanges);
      }

      return updated;
    });
  };

  const toggleRange = (level, rangeLabel) => {
    setSelectedRanges((prev) => {
      const current = prev[level] || [];
      const updated = current.includes(rangeLabel)
        ? current.filter((r) => r !== rangeLabel)
        : [...current, rangeLabel];
      return { ...prev, [level]: updated };
    });
  };

  const hasValidSelection =
    selectedLevels.length > 0 &&
    Object.values(selectedRanges).some((r) => r.length > 0);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-xl md:text-2xl font-semibold text-center">
        Please select the Quiz Type
      </h2>

      <div className="flex gap-4 flex-wrap justify-center">
        {quizTypes.map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`
              w-20 h-16 flex items-center justify-center rounded-md text-lg font-bold border transition-colors duration-200
              ${
                selectedType === type
                  ? "bg-[#FFB8C6] dark:bg-[#FF9D7E]"
                  : "bg-[#FAF9F6] dark:bg-white"
              }
              text-black dark:border-gray-600
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {selectedType && (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-center">
            Please select the JLPT Levels
          </h2>

          <input
            type="number"
            min="1"
            value={chunkSize}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setChunkSize("");
                setWarning("");
                return;
              }

              const numericValue = parseInt(value);
              if (numericValue < 5) {
                setWarning("Cannot partition less than 5");
              } else {
                setWarning("");
              }
              setChunkSize(numericValue.toString());
            }}
            className="border px-2 py-1 rounded text-center w-24 dark:text-black"
          />
          {warning && <p className="text-red-500 text-sm mt-1">{warning}</p>}

          <div className="flex gap-4 flex-wrap justify-center">
            {Object.keys(rangesByLevel).map((level) => (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`
                  w-16 h-16 flex items-center justify-center rounded-md text-lg font-bold border transition-colors duration-200
                  ${
                    selectedLevels.includes(level)
                      ? "bg-[#FFB8C6] dark:bg-[#FF9D7E]"
                      : "bg-[#FAF9F6] dark:bg-white"
                  }
                  text-black dark:border-gray-600
                `}
              >
                {level}
              </button>
            ))}
          </div>

          {selectedLevels.map((level) => (
            <div
              key={level}
              className="flex flex-col gap-2 w-full max-w-4xl px-4"
            >
              <span className="font-semibold text-lg">{level} Ranges:</span>
              <div className="flex flex-wrap gap-2">
                {rangesByLevel[level]?.map((range) => {
                  const isActive = selectedRanges[level]?.includes(range.label);
                  return (
                    <button
                      key={range.label}
                      onClick={() => toggleRange(level, range.label)}
                      className={`
                        px-3 py-3 rounded-md border text-sm font-medium transition-colors duration-200
                        ${
                          isActive
                            ? "bg-[#FFB8C6] dark:bg-[#FF9D7E]"
                            : "bg-[#FAF9F6] dark:bg-white"
                        }
                        text-black dark:border-gray-600
                      `}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}

      <div>
        <QuizTypeJS
          userType={userType}
          quizType={selectedType}
          onSubmit={handleQuestionTypeSubmit}
        />
      </div>

      <div>
        <button
          disabled={!hasValidSelection}
          onClick={() => setIsModalOpen(true)}
          className={`
            px-6 py-2 rounded-lg font-semibold text-white
            ${
              hasValidSelection
                ? "bg-[#FF3A60] dark:bg-[#FF5E2C]"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          Preview
        </button>
      </div>
      {
        <QuizModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={QuestionType}
          selectedRanges={selectedRanges}
          rangesByLevel={rangesByLevel}
          levelInfo={levelInfo}
          selectedType={selectedType}
          selectedLevels={selectedLevels}
        />
      }
    </div>
  );
}
