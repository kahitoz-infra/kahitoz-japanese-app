'use client';

import { useState, useEffect } from 'react';
import styles from './Calendar.module.css';
import dayjs from 'dayjs';

const LOCAL_STORAGE_KEY = 'streakData';

const getMonthDays = (year, month) => {
  const firstDay = dayjs(`${year}-${month}-01`);
  const startDay = firstDay.day() === 0 ? 6 : firstDay.day() - 1; // Week starts on Monday
  const daysInMonth = firstDay.daysInMonth();

  const daysArray = Array(startDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }
  return daysArray;
};

const Calendar = () => {
  const today = dayjs();
  const [year, setYear] = useState(today.year());
  const [month, setMonth] = useState(today.month() + 1);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

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

  const addDayStatus = (dateStr, status) => {
    setUserData((prev) => ({
      ...prev,
      [dateStr]: status,
    }));
  };

  const dateKey = (d) =>
    `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const daysInMonth = getMonthDays(year, month);
  const monthName = dayjs(`${year}-${month}-01`).format('MMMM');

  let streakBroken = false;
  let firstAbsentFound = false;

  const processedDays = daysInMonth.map((d) => {
    if (!d) return { day: null };

    const status = userData[dateKey(d)];

    if (status === 'complete') {
      streakBroken = false;
      return { day: d, status: 'complete' };
    }
    if (status === 'incomplete') {
      streakBroken = false;
      return { day: d, status: 'incomplete' };
    }
    if (status === 'absent') {
      if (!firstAbsentFound) {
        firstAbsentFound = true;
        streakBroken = true;
        return { day: d, status: 'absent' };
      } else if (streakBroken) {
        return { day: d, status: 'empty' };
      }
    }

    return { day: d, status: 'empty' };
  });

  const cycleStatus = (dateStr, current) => {
    const next =
      current === 'complete'
        ? 'incomplete'
        : current === 'incomplete'
        ? 'absent'
        : current === 'absent'
        ? null
        : 'complete';

    if (next) addDayStatus(dateStr, next);
    else {
      const updated = { ...userData };
      delete updated[dateStr];
      setUserData(updated);
    }
  };

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
        {processedDays.map((d, i) => {
          const dateStr = d.day ? dateKey(d.day) : '';
          return (
            <div
              key={i}
              className={`${styles.day} ${d.status ? styles[d.status] : styles.empty}`}
              onClick={() => {
                if (!d.day) return;
                const current = userData[dateStr];
                cycleStatus(dateStr, current);
              }}
            >
              {d.day || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
