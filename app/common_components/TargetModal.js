'use client';

import { useState, useEffect } from 'react';
import LoadCard from './LoadingCard';
import { useGenerateAdaptiveQuiz } from '@/app/utils/generateAdaptiveQuiz';

// Helper function to decode JWT token
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

// Helper function to get auth token from cookies
function getAuthTokenFromCookies() {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

export default function TargetModal({ setOpenModal }) {
  const [kanjiTarget, setKanjiTarget] = useState('');
  const [vocabTarget, setVocabTarget] = useState('');
  const [kanjiError, setKanjiError] = useState('');
  const [vocabError, setVocabError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userSub, setUserSub] = useState('free'); // Default to free
  const generateQuiz = useGenerateAdaptiveQuiz();

  const expiryDuration = 24 * 60 * 60 * 1000; // 24 hours

  // Determine tier limits based on user_sub
  const limits = userSub === 'plus'
    ? { kanji: 40, vocab: 80 }
    : { kanji: 10, vocab: 20 };

  useEffect(() => {
    setIsClient(true);

    // Extract user_sub from auth token
    const authToken = getAuthTokenFromCookies();
    if (authToken) {
      const decodedToken = parseJWT(authToken);
      if (decodedToken && decodedToken.user_sub) {
        setUserSub(decodedToken.user_sub);
      }
    }

    const storedKanji = JSON.parse(localStorage.getItem('kanji_target') || '{}');
    const storedVocab = JSON.parse(localStorage.getItem('vocab_target') || '{}');
    const now = Date.now();

    if (
      storedKanji?.value &&
      storedVocab?.value &&
      now - storedKanji.timestamp < expiryDuration &&
      now - storedVocab.timestamp < expiryDuration
    ) {
      setIsSubmitted(true);
    }
  }, []);

  const handleKanjiChange = (val) => {
    setKanjiTarget(val);
    const num = parseInt(val);

    if (num > limits.kanji) {
      setKanjiError(`Not more than ${limits.kanji} are allowed for ${userSub} users`);
    } else {
      setKanjiError('');
    }
  };

  const handleVocabChange = (val) => {
    setVocabTarget(val);
    const num = parseInt(val);

    if (num > limits.vocab) {
      setVocabError(`Not more than ${limits.vocab} are allowed for ${userSub} users`);
    } else {
      setVocabError('');
    }
  };

  const handleSaveAndGenerate = async () => {
    if (!isClient || isSubmitted) return;

    const kVal = parseInt(kanjiTarget);
    const vVal = parseInt(vocabTarget);

    // final guard against invalid input
    if (kVal > limits.kanji || vVal > limits.vocab) return;

    setIsLoading(true);
    const now = Date.now();

    localStorage.setItem(
      'kanji_target',
      JSON.stringify({ value: kVal, timestamp: now })
    );
    localStorage.setItem(
      'vocab_target',
      JSON.stringify({ value: vVal, timestamp: now })
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
    isSubmitted ||
    !kanjiTarget ||
    !vocabTarget ||
    parseInt(kanjiTarget) <= 0 ||
    parseInt(vocabTarget) <= 0 ||
    kanjiError ||
    vocabError;

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
            Kanji Target (Max: {limits.kanji})
          </label>
          <input
            type="number"
            value={kanjiTarget}
            onChange={(e) => handleKanjiChange(e.target.value)}
            max={limits.kanji}
            className="w-full px-3 py-1 rounded border font-semibold border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] text-black dark:text-white"
            placeholder={`Enter a Kanji Target (1-${limits.kanji})`}
          />
          {kanjiError && (
            <p className="text-xs font-medium text-orange-500 mt-1">{kanjiError}</p>
          )}
        </div>

        {/* Vocabulary Target */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1 text-black dark:text-gray-200">
            Vocabulary Target (Max: {limits.vocab})
          </label>
          <input
            type="number"
            value={vocabTarget}
            onChange={(e) => handleVocabChange(e.target.value)}
            max={limits.vocab}
            className="w-full px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] text-black dark:text-white"
            placeholder={`Enter a Vocab Target (1-${limits.vocab})`}
          />
          {vocabError && (
            <p className="text-xs font-medium text-orange-500 mt-1">{vocabError}</p>
          )}
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