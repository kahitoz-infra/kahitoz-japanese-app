// In /home/naman/kahitoz-japanese-app/app/utils/generateAdaptiveQuiz.js

'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { authFetch } from '@/app/middleware';

export function useGenerateAdaptiveQuiz() {
  const router = useRouter();

  // ... (getLatestTargetValue function is fine)

  const generateQuiz = useCallback(async () => {
    // ... (getting targets and setting API URL is fine)

    try {
      const res = await authFetch(apiUrl);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const quizData = await res.json(); // This has the full quiz (set1, set2, etc.)

      const quizId = Date.now();
      const quizWithMeta = {
        id: quizId,
        date: new Date().toISOString(),
        kanjiTarget,
        vocabTarget,
        quizData, // Save the FULL data to the history list
      };
      
      // --- START: MODIFICATION ---

      // 1. Reset progress for the new quiz
      localStorage.removeItem('completed_sets');

      // 2. Isolate the first set to start the quiz
      const sets = quizData.sets_data;
      const firstSetName = Object.keys(sets)[0]; // e.g., "set1"
      
      if (!firstSetName) {
        console.error("Quiz data does not contain any sets.");
        return;
      }

      const quizForFirstSet = {
        ...quizData, // Copy metadata like quiz_id
        sets_data: {
          [firstSetName]: sets[firstSetName], // Only include the first set
        }
      };
      
      // 3. Save only the first set to the 'active' quiz slot
      localStorage.setItem('adaptive_quiz', JSON.stringify(quizForFirstSet));

      // --- END: MODIFICATION ---


      // Save the complete quiz to the history list
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