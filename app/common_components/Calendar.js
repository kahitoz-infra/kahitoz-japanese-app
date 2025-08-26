'use client';

import { useEffect, useState, useMemo } from 'react';
import styles from './Calendar.module.css';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import Image from 'next/image';

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

export default function Calendar({ refreshKey = 0 }) {
  const today = dayjs();
  const [year, setYear] = useState(today.year());
  const [month, setMonth] = useState(today.month() + 1);
  const [streakData, setStreakData] = useState(() => {
    // Initialize from cache if available
    const cached = localStorage.getItem('streakData');
    return cached ? JSON.parse(cached) : {};
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize month days calculation
  const daysInMonth = useMemo(() => getMonthDays(year, month), [year, month]);
  const monthName = useMemo(() => dayjs(`${year}-${month}-01`).format('MMMM'), [year, month]);

  useEffect(() => {
    const fetchStreakData = async () => {
      setLoading(true);
      setError(null);

      // Add loading timeout
      const timeout = setTimeout(() => {
        setError('Loading is taking longer than expected. Please refresh.');
        setLoading(false);
      }, 5000);

      const token = getCookie('auth_token');

      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        clearTimeout(timeout);
        return;
      }

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/streak_info`;
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();   // auto logout
          } else {
            // Don’t expose raw status to the user
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
          // Cache the streak data
          localStorage.setItem('streakData', JSON.stringify(transformedData));
        }
      } catch (e) {
        console.error('Failed to fetch streak data:', e);
        setError('Could not load streak data.');
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
    return <div className={styles.calendar}></div>;
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