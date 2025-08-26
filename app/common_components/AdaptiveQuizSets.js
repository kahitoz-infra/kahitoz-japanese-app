import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// --- Cherry Blossom Snowfall Background ---
const CherryBlossomSnowfall = ({ isDarkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const color = isDarkMode ? 'rgba(255,102,0,0.5)' : 'rgba(222,49,99,0.5)';

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.6 + 0.6,
      speedY: 0.2 + Math.random() * 0.4,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.005 + Math.random() * 0.01,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.3;
        p.y += p.speedY;
        if (p.y > h) {
          p.y = 0;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

// --- Concentric Circle Component ---
const ConcentricCircle = ({ numSets, completedSets, size, strokeWidth }) => {
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
    const isCompleted = completedSets >= 1;
    paths.push(
      <path 
        key="half1" 
        d={describeArc(0, 179.99)} 
        stroke={isCompleted ? '#10B981' : 'currentColor'}
      />
    );
    paths.push(
      <path 
        key="half2" 
        d={describeArc(180, 359.99)} 
        stroke={isCompleted ? '#10B981' : 'currentColor'}
      />
    );
  } else {
    const angleGap = 10;
    const totalAngle = 360 / numSets;
    for (let i = 0; i < numSets; i++) {
      const start = i * totalAngle + angleGap / 2;
      const end = (i + 1) * totalAngle - angleGap / 2;
      const isCompleted = i < completedSets;
      paths.push(
        <path 
          key={i} 
          d={describeArc(start, end)} 
          stroke={isCompleted ? '#10B981' : 'currentColor'}
        />
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180"
    >
      <g fill="none" strokeWidth={strokeWidth} strokeLinecap="round">
        {paths}
      </g>
    </svg>
  );
};

// --- Set Progress Manager ---
class SetProgressManager {
  static getQuizProgress(quizId) {
    try {
      const stored = localStorage.getItem(`quiz_progress_${quizId}`);
      return stored ? JSON.parse(stored) : { completedSets: [], currentSet: null };
    } catch {
      return { completedSets: [], currentSet: null };
    }
  }

  static saveQuizProgress(quizId, progress) {
    localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify(progress));
  }

  static markSetCompleted(quizId, setKey) {
    const progress = this.getQuizProgress(quizId);
    if (!progress.completedSets.includes(setKey)) {
      progress.completedSets.push(setKey);
    }
    progress.currentSet = null;
    this.saveQuizProgress(quizId, progress);
  }

  static setCurrentSet(quizId, setKey) {
    const progress = this.getQuizProgress(quizId);
    progress.currentSet = setKey;
    this.saveQuizProgress(quizId, progress);
  }

  static getNextAvailableSet(quizData, completedSets) {
    const allSets = Object.keys(quizData.sets_data || {}).sort();
    return allSets.find(setKey => !completedSets.includes(setKey)) || null;
  }
}

// --- Main Adaptive Quiz Sets Component ---
export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      setQuizzes(stored);
    } catch (err) {
      console.error('Failed to parse adaptive_quiz_list:', err);
      setQuizzes([]);
    }
  }, []);

  const handlePlay = (quiz) => {
    const progress = SetProgressManager.getQuizProgress(quiz.id);
    const nextSet = SetProgressManager.getNextAvailableSet(quiz.quizData, progress.completedSets);
    
    if (!nextSet) {
      alert('All sets completed!');
      return;
    }

    // Set current set and navigate to target learning
    SetProgressManager.setCurrentSet(quiz.id, nextSet);
    
    // Store only the current set's data
    const setData = {
      quiz_id: quiz.quizData.quiz_id,
      current_set: nextSet,
      set_data: quiz.quizData.sets_data[nextSet] || [],
      quiz_id_internal: quiz.id,
      total_sets: Object.keys(quiz.quizData.sets_data).length,
      current_set_number: parseInt(nextSet.replace('set', ''))
    };
    
    localStorage.setItem('current_set_quiz', JSON.stringify(setData));
    localStorage.setItem('adaptive_quiz', JSON.stringify({
      quiz_id: quiz.quizData.quiz_id,
      sets_data: { [nextSet]: quiz.quizData.sets_data[nextSet] }
    }));
    
    router.push('/TargetLearning');
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#333333] flex flex-col items-center py-8">
      <CherryBlossomSnowfall isDarkMode={isDarkMode} />

      <div className="w-full max-w-md px-4">
        <div className="relative bg-white border shadow-lg border-[#FF5274] dark:border-[#F66538] dark:bg-gray-100 rounded-full mt-2 py-3 px-6">
          <h1 className="text-center text-2xl font-bold text-black dark:text-black">
            Adaptive Quiz Sets
          </h1>
        </div>
      </div>

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
            const progress = SetProgressManager.getQuizProgress(quiz.id);
            const completedSets = progress.completedSets.length;
            const nextSet = SetProgressManager.getNextAvailableSet(quiz.quizData, progress.completedSets);
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
                    <ConcentricCircle 
                      numSets={numSegments} 
                      completedSets={completedSets}
                      size={isNewest ? 112 : 96} 
                      strokeWidth={8} 
                    />
                  </div>

                  <div
                    className={`relative z-10 flex flex-col items-center justify-center rounded-full shadow-md border-4 transition-all duration-300 cursor-pointer
                      ${isNewest ? 'dark:bg-[#F66538] bg-[#FF5274] hover:scale-110 w-24 h-24' : 'dark:bg-gray-600 bg-gray-400 hover:scale-105 w-20 h-20'}`}
                    onClick={() => handlePlay(quiz)}
                  >
                    {nextSet ? (
                      <>
                        <span className={`text-white font-bold ${isNewest ? 'text-2xl' : 'text-xl'}`}>▶</span>
                        <span className={`text-white text-xs mt-1`}>{nextSet}</span>
                      </>
                    ) : (
                      <span className={`text-white font-bold ${isNewest ? 'text-lg' : 'text-sm'}`}>✓</span>
                    )}
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {completedSets}/{numSegments} completed
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}