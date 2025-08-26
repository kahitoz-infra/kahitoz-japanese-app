'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExampleQuiz from '../common_components/ExampleQuiz';
import AdaptiveQuiz from '../common_components/AdaptiveQuiz';

export default function QuizFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  const phases = [
    { step: 1, type: 'example', phase: 'kanji' },
    { step: 2, type: 'quiz', phase: 'kanji' },
    { step: 3, type: 'example', phase: 'vocabulary' },
    { step: 4, type: 'quiz', phase: 'vocabulary' }
  ];

  const handleStepComplete = () => {
    if (currentStep >= phases.length) {
      router.push('/PostQuiz');
    } else {
      const nextPhase = phases[currentStep];
      localStorage.setItem('current_phase', JSON.stringify({
        phase: nextPhase.phase
      }));
      setCurrentStep(prev => prev + 1);
    }
  };

  const getCurrentComponent = () => {
    const phase = phases[currentStep - 1];
    if (phase.type === 'example') {
      return <ExampleQuiz onComplete={handleStepComplete} />;
    } else {
      return <AdaptiveQuiz onComplete={handleStepComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#333333]">
      {getCurrentComponent()}
    </div>
  );
}
