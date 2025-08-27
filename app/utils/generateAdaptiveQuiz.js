'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { authFetch } from '@/app/middleware';

export function useGenerateAdaptiveQuiz() {
  const router = useRouter();

  const getLatestTargetValue = (key) => {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      return item?.value ?? null;
    } catch {
      console.error(`Invalid localStorage value for ${key}`);
      return null;
    }
  };

  const generateQuiz = useCallback(async () => {
    const kanjiTarget = getLatestTargetValue('kanji_target');
    const vocabTarget = getLatestTargetValue('vocab_target');

    if (!kanjiTarget || !vocabTarget) {
      console.error('Target values not found in localStorage.');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_ADAPT_LEARN;
    const apiUrl = `${baseUrl}/adapt_quiz?kanji_target=${kanjiTarget}&vocab_target=${vocabTarget}`;

    try {
      const res = await authFetch(apiUrl);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const quizData = await res.json();

      const quizId = Date.now();
      const quizWithMeta = {
        id: quizId,
        date: new Date().toISOString(),
        kanjiTarget,
        vocabTarget,
        quizData,
      };

      // Save to individual quiz slot for playing
      localStorage.setItem('adaptive_quiz', JSON.stringify(quizData));

      // Save to quiz history list
      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      } catch {
        console.warn('adaptive_quiz_list was invalid, resetting...');
        existing = [];
      }

      const exists = existing.some(q => q.id === quizId);
      if (!exists) {
        existing.push(quizWithMeta);
      }

      localStorage.setItem('adaptive_quiz_list', JSON.stringify(existing));

      router.push('/TargetLearning');
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    }
  }, [router]);

  return generateQuiz;
}
