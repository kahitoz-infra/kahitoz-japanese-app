'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadCard from '../common_components/LoadingCard';
import { fetch_vocab_data } from '../Screens/logic';

const RecapBlock = () => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vocabList, setVocabList] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);

  // Dark mode
  useEffect(() => {
    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeMedia.matches);
    const handler = (e) => setIsDark(e.matches);
    darkModeMedia.addEventListener('change', handler);
    return () => darkModeMedia.removeEventListener('change', handler);
  }, []);

  // Fetch vocab
  useEffect(() => {
    const loadVocab = async () => {
      setLoading(true);
      try {
        let cache = localStorage.getItem('cacheVocab');
        let data;

        if (cache) {
          data = JSON.parse(cache);
        } else {
          data = await fetch_vocab_data();
          localStorage.setItem('cacheVocab', JSON.stringify(data));
        }

        setVocabList(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setCurrentWord(data[randomIndex]);
        }
      } catch (err) {
        console.error('Error loading vocab for recap block:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVocab();
  }, []);

  // Switch every 1 min
  useEffect(() => {
    if (vocabList.length === 0) return;

    const interval = setInterval(() => {
      setCurrentWord((prev) => {
        if (!prev) return vocabList[Math.floor(Math.random() * vocabList.length)];

        let next;
        do {
          next = vocabList[Math.floor(Math.random() * vocabList.length)];
        } while (next.uid === prev.uid && vocabList.length > 1);

        return next;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [vocabList]);

  if (loading || !currentWord) {
    return <LoadCard />;
  }

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
    word: {
      fontSize: '3rem',
      marginBottom: '10px',
    },
    text: {
      fontSize: '1rem',
    },
  };

  return (
    <div style={styles.block}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.uid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.word}>{currentWord.word}</div>
          <div style={styles.text}>
            <div><strong>Reading:</strong> {currentWord.furigana || '—'}</div>
            <div><strong>Meaning:</strong> {currentWord.meaning}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecapBlock;
