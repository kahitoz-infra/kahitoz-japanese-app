'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import { authFetch } from '../middleware';

export default function StreakUpdater({ onUpdate }) {
  useEffect(() => {
    const updateStreak = async () => {
      // Safety checks
      if (typeof window === 'undefined') {
        console.log('StreakUpdater: Running on server, skipping update');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('StreakUpdater: NEXT_PUBLIC_API_URL is not defined');
        return;
      }

      const today = dayjs().format('YYYY-MM-DD');
      const fullUrl = `${apiUrl}/update_streak?date=${today}`;

      try {
        console.log('StreakUpdater: Attempting to update streak for', today);
        
        const res = await authFetch(fullUrl, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          console.warn(`StreakUpdater: Server responded with status ${res.status}`);
          return;
        }

        const data = await res.json();
        console.log('StreakUpdater: Response received:', data);

        if (data.updated && typeof onUpdate === 'function') {
          console.log('StreakUpdater: Triggering calendar refresh');
          onUpdate(); // 🔁 Triggers re-fetch of streaks
        }
      } catch (err) {
        console.error('StreakUpdater: Silent streak update failed:', err);
        
        // Check for specific error types
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          console.error('StreakUpdater: Network error - possibly CORS or connection issue');
        } else if (err.name === 'AbortError') {
          console.error('StreakUpdater: Request was aborted');
        } else {
          console.error('StreakUpdater: Unknown error type:', err.name, err.message);
        }
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timeoutId = setTimeout(() => {
      updateStreak();
    }, 100);

    // Cleanup timeout if component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onUpdate]); // ensures update runs if parent changes callback

  return null;
}