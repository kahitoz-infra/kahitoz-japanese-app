'use client';

import { useEffect, useState, useCallback } from 'react'; // 👈 Import useCallback
import styles from './Calendar.module.css';
import dayjs from 'dayjs';

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
  const [userData, setUserData] = useState({});

  // ✅ Wrap the data loading logic in a useCallback hook
  const loadLocalStreaks = useCallback(() => {
    try {
      const streaks = JSON.parse(localStorage.getItem('user_streaks') || '{}');
      setUserData(streaks);
      console.log('Calendar data reloaded from localStorage.');
    } catch (e) {
      console.error('Failed to load streaks from localStorage', e);
    }
  }, []);

  // This effect still handles updates from the same page (via refreshKey)
  useEffect(() => {
    loadLocalStreaks();
  }, [refreshKey, loadLocalStreaks]);

  // ✅ ADD THIS NEW useEffect HOOK
  // This effect listens for changes made from other pages
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Check if the change was for our specific 'user_streaks' key
      if (event.key === 'user_streaks') {
        loadLocalStreaks();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadLocalStreaks]); // Re-run if loadLocalStreaks changes (it won't, due to useCallback)

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
  const daysInMonth = getMonthDays(year, month);
  const monthName = dayjs(`${year}-${month}-01`).format('MMMM');

  let streakBroken = false;
  let firstAbsentFound = false;

  const processedDays = daysInMonth.map((d) => {
    if (!d) return { day: null };

    const dateStr = dateKey(d);
    const status = userData[dateStr];
    const isToday = dayjs().isSame(dateStr, 'day');

    if (status === 'complete') return { day: d, status: 'complete', isToday };
    if (status === 'incomplete') return { day: d, status: 'incomplete', isToday };
    if (status === 'absent') {
      if (!firstAbsentFound) {
        firstAbsentFound = true;
        streakBroken = true;
        return { day: d, status: 'absent', isToday };
      } else if (streakBroken) {
        return { day: d, status: 'empty', isToday };
      }
    }

    return { day: d, status: 'empty', isToday };
  });

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
        {processedDays.map((d, i) => (
          <div
            key={i}
            className={`${styles.day} ${d.status ? styles[d.status] : styles.empty} ${
              d.isToday ? styles.today : ''
            }`}
          >
            {d.day || ''}
          </div>
        ))}
      </div>
    </div>
  );
}