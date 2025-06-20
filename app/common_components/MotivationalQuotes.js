'use client';
import { useEffect, useState } from 'react';

export default function MotivationalQuotes() {
  const quotes = [
    "Keep going, you're doing great!",
    "Every step counts!",
    "Believe in yourself.",
    "Stay positive, work hard.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 500); // fade out time
    }, 5000); // quote interval

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-lg font-bold text-gray-700 dark:text-gray-200 mt-6 h-6 transition-opacity duration-500">
      <span className={visible ? 'opacity-100' : 'opacity-0 transition-opacity duration-500'}>
        {quotes[quoteIndex]}
      </span>
    </div>
  );
}
