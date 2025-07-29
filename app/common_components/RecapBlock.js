'use client';
import React, { useEffect, useState } from 'react';

const RecapBlock = ({ kanji, meaning, reading }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeMedia.matches);
    const handler = (e) => setIsDark(e.matches);
    darkModeMedia.addEventListener('change', handler);
    return () => darkModeMedia.removeEventListener('change', handler);
  }, []);

  const styles = {
    block: {
      border: `2px solid ${isDark ? '#BDF6F6' : '#FF5274'}`,
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '300px',
      margin: '20px auto',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      backgroundColor: isDark ? '#323232' : '#FFFFFF',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    kanji: {
      fontSize: '4rem',
      marginBottom: '10px',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    text: {
      fontSize: '1rem',
      color: isDark ? '#FFFFFF' : '#000000',
    },
  };

  return (
    <div style={styles.block}>
      <div style={styles.kanji}>{kanji}</div>
      <div style={styles.text}>
        <div><strong>Meaning:</strong> {meaning}</div>
        <div><strong>Reading:</strong> {reading}</div>
      </div>
    </div>
  );
};

export default RecapBlock;
