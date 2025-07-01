'use client';
import { useEffect, useState } from 'react';

export default function MotivationalQuotes() {
  const quotes = [
    "Keep going, you're doing great!",
    "Every step counts!",
    "Believe in yourself.",
    "Today, we will be better.",
    "Keep your heads high!",
    "Aggregate small gains.",
    "1% Better Every Day!"
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFade('out'); // Start fade-out
      setTimeout(() => {
        // After fade-out, change quote and fade-in
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade('in');
      }, 500); // match fade-out duration
    }, 3000); // change every 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-lg font-bold text-black dark:text-black h-6">
      <span
        className={`inline-block transition-opacity duration-500 ${
          fade === 'in' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {quotes[quoteIndex]}
      </span>
    </div>
  );
}
