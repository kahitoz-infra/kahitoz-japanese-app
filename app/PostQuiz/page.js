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
    const quizData = localStorage.getItem('adaptive_quiz');
    const responseData = localStorage.getItem('adaptive_quiz_responses');

    if (!quizData || !responseData) return;

    try {
      const parsedQuiz = JSON.parse(quizData);
      const parsedResponses = JSON.parse(responseData);
      const { quiz_id, sets_data } = parsedQuiz;
      const { responses } = parsedResponses;

      // 🔹 Build all sets in one payload
      const setsPayload = Object.entries(sets_data).map(([setName, items]) => {
        const questionIds = items
          .filter(i => i.type === 'question')
          .map(i => i._id);

        const matchedResponses = responses
          .filter(r => questionIds.includes(r.q_id))
          .map(r => ({ question_id: r.q_id, correct: r.correct }));

        return { set_name: setName, response: matchedResponses };
      }).filter(set => set.response.length > 0);

      if (setsPayload.length === 0) return;

      const payload = { quiz_id, sets: setsPayload };

      // 🔹 Single API call
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_ADAPT_LEARN}/adapt_evaluate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        console.log("✅ Submitted all sets in one go");

        // ✅ Update streak
        const today = dayjs().format('YYYY-MM-DD');
        const streakRes = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/update_streak?date=${today}`,
          { method: 'PUT' }
        );

        if (!streakRes.ok) {
          console.error('Streak API request failed:', streakRes.statusText);
          return;
        }

        const streakData = await streakRes.json();
        if (streakData.updated) {
          console.log('✅ Streak updated successfully via API.');
          const localStreaks = JSON.parse(localStorage.getItem('user_streaks') || '{}');
          localStreaks[today] = 'complete';
          localStorage.setItem('user_streaks', JSON.stringify(localStreaks));
        }
      } else {
        console.error("❌ Failed to submit quiz:", await res.text());
      }
    } catch (err) {
      console.error('Error submitting adaptive quiz data or updating streak:', err);
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
          <p className="text-md mt-1">Well done</p>
        </div>
        <ProgressCard correct={correct} incorrect={incorrect} />

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