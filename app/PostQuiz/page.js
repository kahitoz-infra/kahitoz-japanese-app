'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProgressCard from '../common_components/ProgressCard';
import CherryBlossomSnowfall from '@/app/common_components/CherryBlossomSnowfall';
import { authFetch } from '@/app/middleware';
import dayjs from 'dayjs'; // Import dayjs for reliable date formatting

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
      const currentSetData = localStorage.getItem('current_set_quiz');
      const responseData = localStorage.getItem('adaptive_quiz_responses');

      if (!currentSetData || !responseData) return;

      try {
        const parsedSet = JSON.parse(currentSetData);
        const parsedResponses = JSON.parse(responseData);
        const { quiz_id, current_set, quiz_id_internal } = parsedSet;
        const { responses } = parsedResponses;

        // Build payload for current set only
        const setPayload = {
          quiz_id,
          sets: [{
            set_name: current_set,
            response: responses.map(r => ({ 
              question_id: r.q_id, 
              correct: r.correct 
            }))
          }]
        };

        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_ADAPT_LEARN}/adapt_evaluate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(setPayload),
          }
        );

        if (res.ok) {
          // Mark this set as completed in SetProgressManager
          SetProgressManager.markSetCompleted(quiz_id_internal, current_set);
          console.log(`✅ Completed set ${current_set}`);

          // Update streak
          const today = dayjs().format('YYYY-MM-DD');
          await updateStreak(today);
        }
      } catch (err) {
        console.error('Error submitting set data:', err);
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
    // ... your JSX remains unchanged ...
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
          <p className="text-md mt-1">
            Set {JSON.parse(localStorage.getItem('current_set_quiz'))?.current_set} Completed!
          </p>
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