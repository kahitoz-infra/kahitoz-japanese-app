'use client';

import { useEffect, useState, useMemo } from 'react';
import styles from './Calendar.module.css';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { authFetch } from '../middleware';

// Helper function to read a specific cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const handleLogout = () => {
  Cookies.remove("auth_token");
  Cookies.remove("refresh_token");

  localStorage.removeItem("darkMode");
  localStorage.removeItem("cherryBlossom");

  window.location.href = "/"; // sends them to login page
};

// Memoize expensive calculations
const getMonthDays = (year, month) => {
  const firstDay = dayjs(`${year}-${month}-01`);
  const startDay = firstDay.day() === 0 ? 6 : firstDay.day() - 1;
  const daysInMonth = firstDay.daysInMonth();
  const daysArray = Array(startDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }
  return daysArray;
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const getCachedData = () => {
  try {
    const cached = localStorage.getItem('calendarCache');
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    if (isExpired) {
      localStorage.removeItem('calendarCache');
      return null;
    }

    return data;
  } catch (error) {
    // If localStorage is corrupted, remove it
    localStorage.removeItem('calendarCache');
    return null;
  }
};

export default function Calendar({ refreshKey = 0 }) {
  const today = dayjs();
  const [year, setYear] = useState(today.year());
  const [month, setMonth] = useState(today.month() + 1);
  const [streakData, setStreakData] = useState(() => {
    const cachedData = getCachedData();
    return cachedData?.streakData || {};
  });
  const [loading, setLoading] = useState(!getCachedData());
  const [error, setError] = useState(null);

  // Memoize month days calculation
  const daysInMonth = useMemo(() => getMonthDays(year, month), [year, month]);
  const monthName = useMemo(() => dayjs(`${year}-${month}-01`).format('MMMM'), [year, month]);

  useEffect(() => {
    const fetchStreakData = async () => {
      // Check cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setStreakData(cachedData.streakData);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Add loading timeout
      const timeout = setTimeout(() => {
        setError('Loading is taking longer than expected. Please refresh.');
        setLoading(false);
      }, 10000); // Increased timeout to 10 seconds

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/streak_info`;
        
        // Use authFetch instead of manual token handling
        const response = await authFetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();   // auto logout
          } else {
            // Don't expose raw status to the user
            setError('Could not load streak data.');
          }
          setStreakData({});
          return;
        }

        const data = await response.json();

        if (data && Array.isArray(data.streak_dates)) {
          const transformedData = data.streak_dates.reduce((acc, date) => {
            acc[date] = 'complete';
            return acc;
          }, {});
          setStreakData(transformedData);
          
          // Cache the complete calendar state
          try {
            localStorage.setItem('calendarCache', JSON.stringify({
              data: {
                streakData: transformedData,
              },
              timestamp: Date.now()
            }));
          } catch (storageError) {
            // localStorage might be full or disabled, continue without caching
            console.warn('Could not save to localStorage:', storageError);
          }
        }
      } catch (e) {
        console.error('Failed to fetch streak data:', e);
        // Check if it's a network error
        if (e.name === 'TypeError' && e.message.includes('fetch')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError('Could not load streak data.');
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchStreakData();
  }, [refreshKey]);

  const handleMonthChange = (direction) => {
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const dateKey = (d) =>
    `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  if (loading) {
    return (
      <div className={styles.calendar}>
        <div className="flex flex-col items-center justify-center py-8">
          <Image
            src="/icons/loading.svg"
            alt="Loading..."
            width={48}
            height={48}
            className="animate-spin"
          />
          <p className="mt-3 text-sm text-black dark:text-white">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.calendar}>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={() => handleMonthChange(-1)}>{'<'}</button>
        <span>{`${monthName} ${year}`}</span>
        <button onClick={() => handleMonthChange(1)}>{'>'}</button>
      </div>

      <div className={styles.weekdays}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
          <div key={`day-${i}`}>{d}</div>
        ))}
      </div>

      <div className={styles.days}>
        {daysInMonth.map((day, i) => {
          if (!day) {
            return <div key={i} className={styles.day}></div>;
          }

          const dateStr = dateKey(day);
          const status = streakData[dateStr] || 'empty';
          const isToday = dayjs().isSame(dateStr, 'day');

          return (
            <div
              key={i}
              className={`${styles.day} ${styles[status]} ${
                isToday ? styles.today : ''
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}