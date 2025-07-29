"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Or "next/router" if using pages
import { authFetch } from "@/app/middleware";
const create_api = process.env.NEXT_PUBLIC_API_LEARN + "/generate_quiz";

export default function QuizModal({
  isOpen,
  onClose,
  type,
  selectedRanges,
  rangesByLevel,
  levelInfo,
  selectedType,
  selectedLevels,
}) {
  const router = useRouter();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const levelUidMap = {};

    for (const level of selectedLevels) {
      const levelData = levelInfo.find((entry) => entry[0] === level);
      if (!levelData) continue;

      const [_, uidStart, uidEnd] = levelData;
      let minUid = Infinity;
      let maxUid = -Infinity;

      const selectedLabels = selectedRanges[level] || [];
      console.log("This is the selected ",selectedLabels)

      for (const label of selectedLabels) {
        if (label.startsWith("Custom")) {
          const match = label.match(/Custom (\d+)-(\d+)/);
          if (match) {
            const start = parseInt(match[1]);
            const end = parseInt(match[2]);
            minUid = Math.min(minUid, start);
            maxUid = Math.max(maxUid, end);
          }
        } else {
          const range = rangesByLevel[level]?.find((r) => r.label === label);
          if (range) {
            minUid = Math.min(minUid, range.uidStart);
            maxUid = Math.max(maxUid, range.uidEnd);
          }
        }
      }

      if (minUid === Infinity || maxUid === -Infinity) {
        minUid = uidStart;
        maxUid = uidEnd;
      }

      levelUidMap[level] = { start: minUid, end: maxUid };
    }
    console.log("Selected type - ",selectedType)
    const cacheKey = selectedType === "Kanji" ? "cacheKanji" : "cacheVocab";
    const cachedRaw = localStorage.getItem(cacheKey);
    let cachedData = [];
    if (cachedRaw) {
      try {
        cachedData = JSON.parse(cachedRaw);
      } catch (e) {
        console.error("Invalid cached data");
      }
    }

    const result = cachedData.filter((item) => {
      const uid = selectedType === "Kanji" ? item.index : item.uid;
      return Object.values(levelUidMap).some(
        ({ start, end }) => uid >= start && uid <= end
      );
    });

    setFilteredData(result);
  }, [
    isOpen,
    selectedType,
    selectedLevels,
    selectedRanges,
    rangesByLevel,
    levelInfo,
  ]);

  const handleStartQuiz = async () => {
    const levelUidMap = {};
    for (const level of selectedLevels) {
      const levelData = levelInfo.find((entry) => entry[0] === level);
      if (!levelData) continue;

      const [_, uidStart, uidEnd] = levelData;
      let minUid = Infinity;
      let maxUid = -Infinity;

      const selectedLabels = selectedRanges[level] || [];

      for (const label of selectedLabels) {
        if (label.startsWith("Custom")) {
          const match = label.match(/Custom (\d+)-(\d+)/);
          if (match) {
            const start = parseInt(match[1]);
            const end = parseInt(match[2]);
            minUid = Math.min(minUid, start);
            maxUid = Math.max(maxUid, end);
          }
        } else {
          const range = rangesByLevel[level]?.find((r) => r.label === label);
          if (range) {
            minUid = Math.min(minUid, range.uidStart);
            maxUid = Math.max(maxUid, range.uidEnd);
          }
        }
      }

      if (minUid === Infinity || maxUid === -Infinity) {
        minUid = uidStart;
        maxUid = uidEnd;
      }

      levelUidMap[level] = { start: minUid, end: maxUid };
    }

    try {
      const res = await authFetch(create_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_type: selectedType.toLowerCase(),
          level_uid_map: levelUidMap,
          question_types: type, 
          notes: "",
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create quiz: ${res.status}`);
      }

      const quizData = await res.json();
      localStorage.setItem("quizData", JSON.stringify(quizData));
      router.push("/Quiz?api_load=false");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-black rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Quiz Information</h2>

            <div className="overflow-y-auto max-h-[50vh] border border-gray-200 rounded mb-6">
              <table className="min-w-full bg-black">
                <thead className="sticky top-0 bg-black">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      S.No
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200  text-left">
                      {selectedType === "Kanji" ? "Kanji" : "Vocab"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {selectedType === "Kanji" ? item.kanji : item.word}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td
                        className="py-2 px-4 border-b border-gray-200"
                        colSpan="2"
                      >
                        No data found for selected ranges.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Fixed buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleStartQuiz}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-[#FF3A60] dark:bg-[#FF5E2C]"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
