'use client';

import { useState, useEffect } from 'react';
import LoadCard from './LoadingCard';
import { useGenerateAdaptiveQuiz } from '@/app/utils/generateAdaptiveQuiz';

export default function TargetModal({ setOpenModal }) {
  const [kanjiTarget, setKanjiTarget] = useState(4); // default 4
  const [vocabTarget, setVocabTarget] = useState(8); // default 8
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuiz = useGenerateAdaptiveQuiz();

  const expiryDuration = 24 * 60 * 60 * 1000; // 24 hours

  useEffect(() => {
    setIsClient(true);

    // load stored targets
    const storedKanji = JSON.parse(localStorage.getItem('kanji_target') || '{}');
    const storedVocab = JSON.parse(localStorage.getItem('vocab_target') || '{}');
    const now = Date.now();

    if (
      storedKanji?.value &&
      storedVocab?.value &&
      now - storedKanji.timestamp < expiryDuration &&
      now - storedVocab.timestamp < expiryDuration
    ) {
      setKanjiTarget(storedKanji.value);
      setVocabTarget(storedVocab.value);
      setIsSubmitted(true);
    }
  }, []);

  const handleSaveAndGenerate = async () => {
    if (!isClient) return;

    setIsLoading(true);
    const now = Date.now();

    localStorage.setItem(
      'kanji_target',
      JSON.stringify({ value: parseInt(kanjiTarget), timestamp: now })
    );
    localStorage.setItem(
      'vocab_target',
      JSON.stringify({ value: parseInt(vocabTarget), timestamp: now })
    );

    try {
      await generateQuiz();
    } finally {
      setIsSubmitted(true);
      setOpenModal(false);
      setIsLoading(false);
    }
  };

  // 🚀 Quick Start with defaults 4 & 8
  const handleQuickStart = async () => {
    if (!isClient) return;

    setIsLoading(true);
    const now = Date.now();

    localStorage.setItem(
      'kanji_target',
      JSON.stringify({ value: 4, timestamp: now })
    );
    localStorage.setItem(
      'vocab_target',
      JSON.stringify({ value: 8, timestamp: now })
    );

    try {
      await generateQuiz();
    } finally {
      setIsSubmitted(true);
      setOpenModal(false);
      setIsLoading(false);
    }
  };

  const isButtonDisabled =
    !kanjiTarget ||
    !vocabTarget ||
    parseInt(kanjiTarget) <= 0 ||
    parseInt(vocabTarget) <= 0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <LoadCard />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl w-80">
        <h2 className="text-xl font-bold mb-6 text-center text-black dark:text-white">
          Set Your Daily Targets
        </h2>

        {/* Kanji Target */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
            Kanji Target
          </label>
          <input
            type="number"
            value={kanjiTarget}
            onChange={(e) => setKanjiTarget(e.target.value)}
            className="w-full px-3 py-1 rounded border font-semibold border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] text-black dark:text-white"
            placeholder="Enter Kanji Target"
          />
        </div>

        {/* Vocabulary Target */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
            Vocabulary Target
          </label>
          <input
            type="number"
            value={vocabTarget}
            onChange={(e) => setVocabTarget(e.target.value)}
            className="w-full px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] text-black dark:text-white"
            placeholder="Enter Vocab Target"
          />
        </div>

        <div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setOpenModal(false)}
              className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-300 dark:bg-[#333333] text-black dark:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveAndGenerate}
              disabled={isButtonDisabled}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isButtonDisabled
                  ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                  : 'bg-[#FF6E8A] dark:bg-[#FF9270] text-black'
              }`}
            >
              Take a Test
            </button>
          </div>

          {isSubmitted && (
            <p className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
              You've already set your targets for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
