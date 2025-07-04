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
      borderRadius: '1rem',
      padding: '5vw',
      width: '90%',
      maxWidth: '500px',
      margin: '20px auto',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      backgroundColor: isDark ? '#323232' : '#FFFFFF',
      color: isDark ? '#FFFFFF' : '#000000',
      transition: 'all 0.3s ease',
    },
    kanji: {
      fontSize: '10vw',
      maxFontSize: '6rem',
      minFontSize: '3rem',
      marginBottom: '1rem',
      color: isDark ? '#FFFFFF' : '#000000',
    },
    text: {
      fontSize: '4vw',
      minFontSize: '1rem',
      maxFontSize: '1.5rem',
      lineHeight: 1.5,
      color: isDark ? '#FFFFFF' : '#000000',
    },
  };

  return (
    <div style={styles.block}>
      <div style={{ ...styles.kanji, fontSize: 'min(10vw, 6rem)' }}>{kanji}</div>
      <div style={{ ...styles.text, fontSize: 'min(4vw, 1.25rem)' }}>
        <div><strong>Meaning:</strong> {meaning}</div>
        <div><strong>Reading:</strong> {reading}</div>
      </div>
    </div>
  );
};

export default RecapBlock;
