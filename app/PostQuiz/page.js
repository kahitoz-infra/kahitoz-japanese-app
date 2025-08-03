'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProgressCard from '../common_components/ProgressCard';
import CherryBlossomSnowfall from '@/app/common_components/CherryBlossomSnowfall';
import { authFetch } from '@/app/middleware';

export default function PostQuizPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [responses, setResponses] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  useEffect(() => {
    const raw =
      localStorage.getItem('adaptive_quiz_responses') ||
      localStorage.getItem('quizResponses');

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const respArray = Array.isArray(parsed) ? parsed : parsed.responses || [];
        setResponses(respArray);
        setCorrect(respArray.filter(r => r.correct).length);
        setIncorrect(respArray.filter(r => !r.correct).length);
      } catch (error) {
        console.error('Failed to parse stored responses:', error);
      }
    }
  }, []);

  useEffect(() => {
    const sendAdaptiveQuizData = async () => {
      const quizData = localStorage.getItem('adaptive_quiz');
      const responseData = localStorage.getItem('adaptive_quiz_responses');

      if (!quizData || !responseData) return;

      try {
        const parsedQuiz = JSON.parse(quizData);
        const parsedResponses = JSON.parse(responseData);
        const { quiz_id, sets_data } = parsedQuiz;
        const { responses } = parsedResponses;
        let anySuccess = false;

        for (const setName in sets_data) {
          const items = sets_data[setName];
          const questionIds = items.filter(i => i.type === 'question').map(i => i._id);
          const matchedResponses = responses
            .filter(r => questionIds.includes(r.q_id))
            .map(r => ({ question_id: r.q_id, correct: r.correct }));

          if (matchedResponses.length === 0) continue;

          const payload = { quiz_id, set_name: setName, response: matchedResponses };

          const res = await authFetch(
            `${process.env.NEXT_PUBLIC_API_ADAPT_LEARN}/adapt_evaluate`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            }
          );

          if (res.ok) {
            console.log(`✅ Submitted responses for ${setName}`);
            anySuccess = true;
          }
        }

        if (anySuccess) {
          const today = new Date().toISOString().split('T')[0];

          const streakRes = await authFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/update_streak?date=${today}`,
            { method: 'PUT' }
          );

          const streakData = await streakRes.json();
          const localStreaks = JSON.parse(localStorage.getItem('user_streaks') || '{}');

          if (streakData.updated) {
            console.log('✅ Streak updated successfully');
            localStreaks[today] = 'complete';
          } else {
            console.warn('ℹ️ Streak already updated or skipped');
            localStreaks[today] = 'incomplete';
          }

          localStorage.setItem('user_streaks', JSON.stringify(localStreaks));
        }
      } catch (err) {
        console.error('Error submitting adaptive quiz data:', err);
      }
    };

    sendAdaptiveQuizData();
  }, []);

  useEffect(() => {
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(match.matches);
    const listener = (e) => setIsDarkMode(e.matches);
    match.addEventListener('change', listener);
    return () => match.removeEventListener('change', listener);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] dark:bg-[#333333] text-white relative z-10">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />
      <div className="flex flex-col items-center justify-center gap-6 py-10 px-4 relative z-10">
        <div className="w-24 h-24 dark:hidden rounded-full relative border-b-2 border-[#FF5274] mt-4 overflow-hidden">
          <Image src="/chibi_well_done.png" alt="Well done" fill className="object-cover" />
        </div>
        <div className="w-24 h-24 hidden dark:flex rounded-full relative border-b-2 border-[#F66538] mt-4 overflow-hidden">
          <Image src="/chibi_well_done_dark.png" alt="Well done" fill className="object-cover" />
        </div>
        <div className="text-center text-black dark:text-white">
          <h1 className="text-3xl font-bold mt-4">よくできました</h1>
          <p className="text-md mt-1">Well done</p>
        </div>
        <ProgressCard correct={correct} incorrect={incorrect} />

        
         <div>
          <button
            onClick={() => router.push('/AdaptiveSets')}
            className="text-sm px-4 py-4 font-bold bg-[#FF3A60] dark:bg-white text:white dark:text-black rounded-2xl"
          >
            View Adaptive Quiz Sets
          </button>
        </div>

        <div>
          <button
            onClick={() => router.push('/')}
            className="text-sm px-4 py-4 font-semibold bg-[#FF3A60] dark:bg-white text:white dark:text-black rounded-2xl"
          >
            &lt; Back to Homepage
          </button>
        </div>

      </div>
    </div>
  );
}
