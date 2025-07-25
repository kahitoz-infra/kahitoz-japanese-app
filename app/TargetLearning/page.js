'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../middleware'; // adjust if needed
import PlayButton from './components/PlayButton';

const API_URL = process.env.NEXT_PUBLIC_API_ADAPT_LEARN;

function TargetLearning() {
  const [setsData, setSetsData] = useState([]);
  const router = useRouter();

    useEffect(() => {
    const cached = localStorage.getItem('setsData');
    if (cached) {
      try {
        setSetsData(JSON.parse(cached));
      } catch (err) {
        console.error('Error parsing cached setsData:', err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchSets() {
      try {
        const res = await authFetch(`${API_URL}`);
        const json = await res.json();

        if (Array.isArray(json) && json.length > 0) {
          const { sets } = json[0];
          setSetsData(sets);
        }
      } catch (err) {
        console.error("Failed to fetch sets:", err);
      }
    }

    fetchSets();
  }, []);

  const completedCount = setsData.filter(set => set.completed).length;
  const progressPercent = setsData.length > 0
    ? Math.round((completedCount / setsData.length) * 100)
    : 0;

  const handleQuizStart = (setId) => {
    router.push(`/Quiz?set_id=${setId}`);
  };

  // Only show max 9 sets at a time in 3x3
  const visibleSets = setsData.slice(0, 9);
  const firstIncompleteIndex = visibleSets.findIndex(set => !set.completed);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Sets</h1>

      <div className="grid grid-cols-3 gap-6">
      {visibleSets.map((set, index) => {
        const isCurrent = index === firstIncompleteIndex;

        return (
          <div key={index} className="flex flex-col items-center gap-2">
            {set.completed ? (
              <PlayButton progress={100} />
            ) : isCurrent ? (
              <PlayButton
                progress={0}
                onClick={() => handleQuizStart(set.set_id)}
              />
            ) : (
              <div className="opacity-20 pointer-events-none">
                <PlayButton progress={0} />
              </div>
            )}
            <p className="text-center text-sm font-medium">{set.set_name}</p>
          </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-10 flex flex-col items-center">
        <p className="text-lg font-semibold">Overall Progress</p>
        <PlayButton progress={progressPercent} />
        <p className="text-sm mt-2">{progressPercent}% Completed</p>
      </div>
    </div>
  );
}

export default TargetLearning;
