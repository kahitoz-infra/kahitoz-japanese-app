'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import AdaptiveQuizPageContent from '../common_components/AdaptiveQuiz';
import ExampleQuiz from '../common_components/ExampleQuiz';

export default function AdaptiveQuiz() {
  const [hasExamples, setHasExamples] = useState(null); // null = loading
  const [showExamples, setShowExamples] = useState(true);

  useEffect(() => {
    const rawData = localStorage.getItem('adaptive_quiz');
    if (!rawData) {
      setHasExamples(false);
      return;
    }

    try {
      const parsed = JSON.parse(rawData);
      const sets = Object.values(parsed.sets_data || {}).flat();
      const foundExamples = sets.filter((item) => item.type === 'example');
      setHasExamples(foundExamples.length > 0);
    } catch {
      setHasExamples(false);
    }
  }, []);

  if (hasExamples === null) {
    return <p className="p-4 text-center">Loading quiz...</p>;
  }

  if (hasExamples && showExamples) {
    return <ExampleQuiz onComplete={() => setShowExamples(false)} />;
  }

  return (
    <Suspense fallback={<p className="p-4 text-center">Loading quiz...</p>}>
      <AdaptiveQuizPageContent />
    </Suspense>
  );
}
