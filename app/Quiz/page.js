// app/Quiz/page.js

import { Suspense } from 'react';
import QuizPageContent from './QuizPageContent';

export default function QuizPage() {
  return (
    <Suspense fallback={<p className="p-4 text-center">Loading quiz...</p>}>
      <QuizPageContent />
    </Suspense>
  );
}
