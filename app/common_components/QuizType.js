'use client';
import { useState, useEffect } from "react";

export default function QuizTypeJS({ userType, quizType, onSubmit }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);

  const kanjiQuestionType = {
    free: ["Meaning to Kanji"],
    plus: ["Ask Kanji with Onyomi and Kunyomi as Options", "Ask Onyomi and Kunyomi with Kanji as Options"],
  };

  const vocabQuestionType = {
    free: ["Meaning to word"],
    plus: ["Word to Meaning"],
  };

  const getAvailableTypes = (questionType) => {
    if (userType === "plus") {
      return [...questionType.free, ...questionType.plus];
    }
    return questionType.free;
  };

  // ✅ Sync options on change
  useEffect(() => {
    let options = [];
    if (quizType === "Kanji") {
      options = getAvailableTypes(kanjiQuestionType);
    } else if (quizType === "Vocab") {
      options = getAvailableTypes(vocabQuestionType);
    }
    setAvailableOptions(options);

    if (options.length === 1) {
      setSelectedOptions(options);
      onSubmit?.(options);
    } else {
      setSelectedOptions([]);
      onSubmit?.([]);
    }
  }, [quizType, userType]);

  const handleToggleOption = (option) => {
    if (availableOptions.length === 1) return; // single option locked

    setSelectedOptions((prev) => {
      const updated = prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option];
      onSubmit?.(updated);
      return updated;
    });
  };

  const renderButtons = (title, questionType) => {
    const allOptions = [...questionType.free, ...questionType.plus];
    const isSingleLocked = availableOptions.length === 1;

    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2">{title}</h3>
        <div className="flex gap-2 flex-wrap">
          {allOptions.map((option) => {
            const isAvailable = availableOptions.includes(option);
            const isLocked = !isAvailable;
            const isSingleSelected = isSingleLocked && isAvailable;
            const isSelected = selectedOptions.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleToggleOption(option)}
                disabled={isLocked || isSingleSelected}
                className={`px-4 py-2 rounded border flex items-center gap-1 ${
                  isLocked || isSingleSelected
                    ? isSelected
                      ? "bg-[#FFB8C6] dark:bg-[#FF9D7E] text-black font-bold cursor-default"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {option} {isLocked && "🔒"}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!quizType) return null; // ✅ Don’t render if not set

  return (
    <div className="p-4">
      {availableOptions.length === 0 && (
        <p className="text-red-600 mt-2">
          ⚠️ No question types available for your plan.
        </p>
      )}

      {quizType === "Kanji" && availableOptions.length > 0 &&
        renderButtons("Kanji Question Types", kanjiQuestionType)}

      {quizType === "Vocab" && availableOptions.length > 0 &&
        renderButtons("Vocab Question Types", vocabQuestionType)}

      {availableOptions.length > 1 && selectedOptions.length === 0 && (
        <p className="text-red-600 mt-2">
          ⚠️ Please select at least one question type.
        </p>
      )}

      {selectedOptions.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            ✅ Selected: {selectedOptions.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
