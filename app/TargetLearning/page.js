// app/Quiz/page.js

import { Suspense } from 'react';
import AdaptiveQuizPageContent from './AdaptiveQuiz';

export default function AdaptiveQuiz() {
  return (
    <Suspense fallback={<p className="p-4 text-center">Loading quiz...</p>}>
      <AdaptiveQuizPageContent/>
    </Suspense>
  );
}