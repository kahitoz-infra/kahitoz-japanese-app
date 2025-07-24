'use client';
import React, { useEffect, useState } from 'react';
import { authFetch } from '../middleware'; // Assuming middleware.js is in root
import PlayButton from './components/PlayButton';

const API_URL = process.env.NEXT_PUBLIC_API_ADAPT_LEARN;

function TargetLearning() {
  const [setsData, setSetsData] = useState([]);

  useEffect(() => {
    async function fetchSets() {
      try {
        const res = await authFetch(`${API_URL}`);
        const json = await res.json();

        if (Array.isArray(json) && json.length > 0) {
          const { sets } = json[0]; // assuming only one quiz_id's data
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Sets</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {setsData.map((set, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <PlayButton progress={set.completed ? 100 : 0} />
            <p className="text-center text-sm font-medium">{set.set_name}</p>
          </div>
        ))}
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
