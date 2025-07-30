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
      const res = await authFetch(apiUrl); // ✅ use authFetch
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const quizData = await res.json();

      localStorage.setItem('adaptive_quiz', JSON.stringify(quizData));
      router.push('/TargetLearning');
    } catch (err) {
      console.error('Failed to fetch quiz:', err);
    }
  }, [router]);

  return generateQuiz;
}
