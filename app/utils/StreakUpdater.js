'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import { authFetch } from '../middleware';

export default function StreakUpdater({ onUpdate }) {
  useEffect(() => {
    const updateStreak = async () => {
      const today = dayjs().format('YYYY-MM-DD');

      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/update_streak?date=${today}`,
          { method: 'PUT' }
        );

        const data = await res.json();

        if (data.updated && typeof onUpdate === 'function') {
          onUpdate(); // 🔁 Triggers re-fetch of streaks
        }
      } catch (err) {
        console.error('Silent streak update failed:', err);
      }
    };

    updateStreak();
  }, [onUpdate]); // ensures update runs if parent changes callback

  return null;
}