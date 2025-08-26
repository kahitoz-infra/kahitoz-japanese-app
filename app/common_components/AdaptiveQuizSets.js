'use client';
import { useState, useEffect } from 'react';
import CherryBlossomSnowfall from "./CherryBlossomSnowfall";

// --- Concentric Circle Component ---
const ConcentricCircle = ({ numSets, size, strokeWidth }) => {
  if (!numSets || numSets <= 0) return null;

  const center = size / 2;
  const radius = center - strokeWidth / 2;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeArc = (startAngle, endAngle) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const paths = [];
  if (numSets === 1) {
    paths.push(<path key="half1" d={describeArc(0, 179.99)} />);
    paths.push(<path key="half2" d={describeArc(180, 359.99)} />);
  } else {
    const angleGap = 10;
    const totalAngle = 360 / numSets;
    for (let i = 0; i < numSets; i++) {
      const start = i * totalAngle + angleGap / 2;
      const end = (i + 1) * totalAngle - angleGap / 2;
      paths.push(<path key={i} d={describeArc(start, end)} />);
    }
  }

  return (
    <svg
      width={size}
      height={size}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180"
    >
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        {paths}
      </g>
    </svg>
  );
};

// --- Main Adaptive Quiz Sets Component ---
export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem('adaptive_quiz_list')) {
        const mockQuizzes = [
          { id: 1, quizData: { sets_data: { set1: [] } } },
          { id: 2, quizData: { sets_data: { set1: [], set2: [] } } },
          { id: 3, quizData: { sets_data: { set1: [], set2: [], set3: [], set4: [] } } },
        ];
        localStorage.setItem('adaptive_quiz_list', JSON.stringify(mockQuizzes));
      }
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      setQuizzes(stored);
    } catch (err) {
      console.error('Failed to parse adaptive_quiz_list:', err);
      setQuizzes([]);
    }
  }, []);

  const handlePlay = (quiz) => {
    localStorage.setItem('adaptive_quiz', JSON.stringify(quiz.quizData));
    window.location.href = '/TargetLearning';
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#333333] flex flex-col items-center py-8">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />
      
      {/* Quiz List or Empty Message */}
      {quizzes.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No quizzes yet.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Generate one to get started!</p>
        </div>
      ) : (
        <div className="mt-8">
          {quizzes.map((quiz, index) => {
            const isNewest = index === quizzes.length - 1;
            const numSegments = quiz.quizData?.sets_data ? Object.keys(quiz.quizData.sets_data).length : 0;
            const circleColorClass = 'text-white dark:text-gray-200';

            return (
              <div key={quiz.id} className="relative flex flex-col items-center">
                {index > 0 && (
                  <div className="border-l-4 border-dotted border-[#FF5274] dark:border-[#F66538] h-16"></div>
                )}

                <div
                  className="relative flex items-center justify-center my-2"
                  style={{ width: isNewest ? '112px' : '96px', height: isNewest ? '112px' : '96px' }}
                >
                  <div className={`absolute w-full h-full ${circleColorClass}`}>
                    <ConcentricCircle numSets={numSegments} size={isNewest ? 112 : 96} strokeWidth={8} />
                  </div>

                  <div
                    className={`relative z-10 flex items-center justify-center rounded-full shadow-md border-4 transition-all duration-300 cursor-pointer
                      ${isNewest ? 'dark:bg-[#F66538] bg-[#FF5274] hover:scale-110 w-24 h-24' : 'dark:bg-gray-600 bg-gray-400 hover:scale-105 w-20 h-20'}`}
                    onClick={() => handlePlay(quiz)}
                  >
                    <span className={`text-white font-bold ${isNewest ? 'text-2xl' : 'text-xl'}`}>▶</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
