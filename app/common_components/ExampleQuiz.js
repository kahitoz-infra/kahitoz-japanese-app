'use client';

import { useState } from 'react';

export default function ExampleQuiz({ data, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (data.length === 0) {
    onComplete();
    return null;
  }

  const example = data[currentIndex];
  const isLast = currentIndex === data.length - 1;

  const handleNext = () => {
    if (isLast) onComplete();
    else setCurrentIndex(prev => prev + 1);
  };

  // Collect onyomi/kunyomi options
  const options = [
    ...(example.onyomi?.map(r => ({ value: r, label: `Onyomi: ${r}` })) || []),
    ...(example.kunyomi?.map(r => ({ value: r, label: `Kunyomi: ${r}` })) || []),
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-10 pb-40 text-black dark:text-white">
      <h1 className="font-bold text-2xl text-center mb-4">Examples</h1>

      <div className="w-full max-w-xl rounded-xl shadow-md border border-[#FF5274] dark:border-[#F66538] bg-white dark:bg-[#2F2F2F] p-6 mt-8">
        <h2 className="text-xl font-bold mb-2 text-center">
          Example {currentIndex + 1} of {data.length}
        </h2>
        <p className="text-center text-lg font-medium mb-4">
          {example.kanji && <><span className="font-bold">Kanji:</span> {example.kanji}</>}
          {example.word && <><span className="font-bold">Word:</span> {example.word}</>}
        </p>
        {example.sentence && <p><b>Sentence:</b> {example.sentence}</p>}
        {example.translation && <p><b>Translation:</b> {example.translation}</p>}
        {example.explanation && (
          <p className="mt-2 text-sm italic">💡 {example.explanation}</p>
        )}
        {options.length > 0 && (
          <div className="grid gap-2 mt-4">
            {options.map(opt => (
              <div
                key={opt.value}
                className="p-2 border rounded bg-gray-100 dark:bg-gray-700"
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        className="fixed bottom-4 w-[90%] max-w-xl px-6 py-4 text-lg font-bold rounded-lg bg-[#FF5274] dark:bg-[#F66538] text-white hover:opacity-90 transition-all"
      >
        {isLast ? 'Start Quiz' : 'Next'}
      </button>
    </div>
  );
}
