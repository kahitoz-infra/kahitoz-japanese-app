'use client';
import { useState } from 'react';

export default function TargetModal({ setOpenModal }) {
  const [kanjiTarget, setKanjiTarget] = useState(
    localStorage.getItem('dailyKanjiTarget') || ''
  );
  const [vocabTarget, setVocabTarget] = useState(
    localStorage.getItem('dailyVocabTarget') || ''
  );

  const handleSave = () => {
    localStorage.setItem('dailyKanjiTarget', kanjiTarget);
    localStorage.setItem('dailyVocabTarget', vocabTarget);
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black dark:border border-white bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-xl w-80">
        <h2 className="text-xl font-bold mb-6 text-center text-black dark:text-white">
          Set Your Daily Targets
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
            Kanji Target
          </label>
          <input
            type="number"
            value={kanjiTarget}
            onChange={(e) => setKanjiTarget(e.target.value)}
            className="w-full px-3 py-1 rounded border font-semibold border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] text-black dark:text-white"
            placeholder="Enter a Kanji Target"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
            Vocabulary Target
          </label>
          <input
            type="number"
            value={vocabTarget}
            onChange={(e) => setVocabTarget(e.target.value)}
            className="w-full px-3 py-1 rounded font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] text-black dark:text-white"
            placeholder="Enter a Vocab Target"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpenModal(false)}
            className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-300 dark:bg-[#333333] text-black dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FF6E8A] dark:bg-[#FF9270] text-black"
          >
            Take a Test
          </button>
        </div>
      </div>
    </div>
  );
}
