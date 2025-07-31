'use client';

import { useEffect, useState } from 'react';
import { formatOption } from '../utils/formatOption';
import { formatQuestion } from '../utils/formatOption'; // Optional based on usage

export default function ExampleQuiz({ onComplete }) {
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawData = localStorage.getItem('adaptive_quiz');
    if (!rawData) {
      console.error('adaptive_quiz not found in localStorage');
      onComplete(); // Treat as no examples
      return;
    }

    try {
      const parsed = JSON.parse(rawData);
      const sets = Object.values(parsed.sets_data || {}).flat();

      // Correctly extract examples from each example-entry's internal .examples array
      const foundExamples = sets
        .filter((item) => item.type === 'example' && Array.isArray(item.examples))
        .flatMap((item) =>
          item.examples.map((ex) => ({
            ...ex,
            kanji: item.kanji || item._id,
            onyomi: item.onyomi || [],
            kunyomi: item.kunyomi || [],
          }))
        );

      if (foundExamples.length === 0) {
        onComplete(); // No examples, continue to quiz
      } else {
        setExamples(foundExamples);
      }
    } catch (err) {
      console.error('Failed to parse adaptive_quiz data:', err);
      onComplete();
    } finally {
      setLoading(false);
    }
  }, [onComplete]);

  const handleNext = () => {
    const isLast = currentExampleIndex === examples.length - 1;
    if (isLast) {
      onComplete(); // Notify parent to load quiz
    } else {
      setCurrentExampleIndex((prev) => prev + 1);
    }
  };

  if (loading) return <p className="p-4 text-center">Loading examples...</p>;
  if (examples.length === 0) return null;

  const example = examples[currentExampleIndex];
  const kanji = example.kanji || example._id;
  const selected = example.reading;

  const options = [];

  if (example.onyomi?.length) {
    options.push(...example.onyomi.map((r) => ({ value: r, label: `Onyomi: ${r}` })));
  }

  if (example.kunyomi?.length) {
    options.push(...example.kunyomi.map((r) => ({ value: r, label: `Kunyomi: ${r}` })));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-10 pb-40 text-black dark:text-white">
      <div className="w-full max-w-xl rounded-xl shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2F2F2F] p-6 mb-4">
        <h2 className="text-xl font-bold mb-2 text-center">
          Example {currentExampleIndex + 1} of {examples.length}
        </h2>

        <p className="text-center text-lg font-medium mb-4">
          <span className="font-bold">Kanji:</span> {kanji}
        </p>

        <div className="text-base md:text-lg leading-relaxed mb-4">
          <p><span className="font-bold">Sentence:</span> {example.sentence}</p>
          <p><span className="font-bold">Translation:</span> {example.translation}</p>
          {example.explanation && (
            <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">
              💡 {example.explanation}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`p-3 rounded border font-medium ${
                opt.value === selected
                  ? 'bg-green-200 border-green-500 dark:bg-green-700 dark:border-green-400 text-black dark:text-white'
                  : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="fixed bottom-4 w-[90%] max-w-xl px-6 py-4 text-lg font-bold rounded-lg bg-[#FF5274] dark:bg-[#F66538] text-white hover:opacity-90 transition-all"
      >
        {currentExampleIndex === examples.length - 1 ? 'Start Quiz' : 'Next'}
      </button>
    </div>
  );
}
