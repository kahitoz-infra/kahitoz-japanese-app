'use client';
import { useState, useEffect } from 'react';

/**
 * A component to render a segmented concentric circle using SVG.
 * This version uses a thick stroke with rounded caps to create the segments,
 * which provides a clean, modern look with built-in spacing and rounded ends.
 */
const ConcentricCircle = ({ numSets, size, strokeWidth }) => {
  // If there are no sets, don't render anything.
  if (!numSets || numSets <= 0) {
    return null;
  }

  const center = size / 2;
  // The radius is calculated to the center of the stroke.
  const radius = center - strokeWidth / 2;

  /**
   * Helper function to convert polar coordinates (angle, radius)
   * to Cartesian coordinates (x, y) for SVG pathing.
   */
  function polarToCartesian(centerX, centerY, r, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  }
  
  /**
   * Describes the path for a single arc, which will be stroked to create a segment.
   */
  function describeArc(startAngle, endAngle) {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);

    // This flag determines if the arc should be drawn the long way around (>180 degrees).
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');

    return d;
  }

  const paths = [];
  
  if (numSets === 1) {
    // For a single set, we draw a full circle by creating two 180-degree arcs.
    paths.push(<path key="half1" d={describeArc(0, 179.99)} />);
    paths.push(<path key="half2" d={describeArc(180, 359.99)} />);
  } else {
    // Define a larger visible gap in degrees to ensure rounded caps don't overlap.
    const angleGap = 10;
    const totalAnglePerSegment = 360 / numSets;
    
    for (let i = 0; i < numSets; i++) {
        const segmentStart = i * totalAnglePerSegment;
        
        // To create a gap, we start the arc slightly after the segment's start
        // and end it slightly before the segment's end.
        const arcStartAngle = segmentStart + angleGap / 2;
        const arcEndAngle = segmentStart + totalAnglePerSegment - angleGap / 2;
        
        paths.push(<path key={i} d={describeArc(arcStartAngle, arcEndAngle)} />);
    }
  }

  return (
    // The SVG container is rotated by 180 degrees to start the first segment at the bottom.
    <svg
      width={size}
      height={size}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180"
    >
      <g 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      >
        {paths}
      </g>
    </svg>
  );
};


export default function AdaptiveQuizSets() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    try {
      // Create mock data for demonstration if localStorage is empty
      if (!localStorage.getItem('adaptive_quiz_list')) {
          const mockQuizzes = [
              { id: 1, quizData: { sets_data: { set1: [] } } },
              { id: 2, quizData: { sets_data: { set1: [], set2: [] } } },
              { id: 3, quizData: { sets_data: { set1: [], set2: [], set3: [], set4: [] } } },
          ];
          localStorage.setItem('adaptive_quiz_list', JSON.stringify(mockQuizzes));
      }
      
      // Retrieve the list of quizzes from localStorage
      const stored = JSON.parse(localStorage.getItem('adaptive_quiz_list')) || [];
      // Set the quizzes in state in their original chronological order (oldest first)
      setQuizzes(stored);
    } catch (err)      {
      console.error('Failed to parse adaptive_quiz_list from localStorage:', err);
      setQuizzes([]); // Reset to empty array on error
    }
  }, []);

  /**
   * Handles playing a selected quiz.
   * Stores the selected quiz data in localStorage and navigates to the learning page.
   * @param {object} quiz - The quiz object to be played.
   */
  const handlePlay = (quiz) => {
    localStorage.setItem('adaptive_quiz', JSON.stringify(quiz.quizData));
    // In a non-Next.js environment, we can simulate navigation like this.
    window.location.href = '/TargetLearning';
  };

  return (
    <div className="flex flex-col items-center py-8 relative bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Title */}
      <div className="w-full max-w-md px-4">
        <div className="relative bg-white border shadow-lg border-[#FF5274] dark:border-[#F66538] dark:bg-gray-100 rounded-full mt-2 py-3 px-6">
          <h1 className="text-center text-2xl font-bold text-black dark:text-black">
            Adaptive Quiz Sets
          </h1>
        </div>
      </div>

      {/* Quiz List or Empty Message */}
      {quizzes.length === 0 ? (
        <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
            No quizzes yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
            Generate one to get started!
            </p>
        </div>
      ) : (
        <div className="mt-8">
            {quizzes.map((quiz, index) => {
            const isNewest = index === quizzes.length - 1;
            
            // The number of segments is now equal to the number of sets.
            const numSegments = quiz.quizData?.sets_data ? Object.keys(quiz.quizData.sets_data).length : 0;

            // Define the color for the circle segments based on the theme.
            const circleColorClass = 'text-gray-800 dark:text-gray-200';

            return (
                <div key={quiz.id} className="relative flex flex-col items-center">
                    {/* Dotted connector line - shown for all but the first (oldest) item */}
                    {index > 0 && (
                        <div
                        className="border-l-4 border-dotted border-[#FF5274] dark:border-[#F66538] h-16"
                        ></div>
                    )}
                    
                    {/* Container for the button and the circle for proper alignment */}
                    <div className="relative flex items-center justify-center my-2" 
                        style={{width: isNewest ? '112px' : '96px', height: isNewest ? '112px' : '96px'}}>
                        
                        {/* Wrapper to set the color for the SVG */}
                        <div className={`absolute w-full h-full ${circleColorClass}`}>
                            <ConcentricCircle 
                                numSets={numSegments}
                                size={isNewest ? 112 : 96}
                                strokeWidth={8}
                            />
                        </div>

                        {/* Play Button */}
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
