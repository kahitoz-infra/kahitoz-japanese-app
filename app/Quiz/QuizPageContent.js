'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuizQuestion from './components/QuizQuestion';
import ProgressBar from '../common_components/ProgressBar';
import { authFetch } from '../middleware';
import { formatOption } from './utils/formatOption';

export default function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizKey, setQuizKey] = useState('');
  const [set, setSet] = useState('');
  const set_id = searchParams.get('set_id');


  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
  const loadQuestions = async () => {
    if (!set_id) {
      console.error("Missing set_id");
      setLoading(false);
      return;
    }

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_LEARN}/start_quiz?set_id=${set_id}`
      );
      const data = await res.json();

      if (res.ok && data?.questions?.length > 0) {
        setQuestions(data.questions);
        setQuizKey(data.quiz_key || 'default_quiz_key');
        setSet(data.set_key || 'default_set');
      } else {
        console.error(data.detail || 'Failed to load questions');
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  loadQuestions();
}, [set_id]);


  const handleOptionClick = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      localStorage.setItem('quizResponses', JSON.stringify(responses));

      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_LEARN}/save_quiz_results`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quiz_key: quizKey,
              set_name: set,
              results: responses.map((r) => JSON.stringify(r)),
            }),
          }
        );

        if (!res.ok) {
          console.error('Failed to save quiz results:', await res.text());
        } else {
          console.log('Quiz results saved successfully.');
        }
      } catch (err) {
        console.error('Error saving quiz results:', err);
      }

      router.push('/PostQuiz');
    }
  };


  if (loading) return <p className="p-4 text-center">Loading...</p>;
  if (!currentQuestion) return <p className="p-4 text-center">No questions found.</p>;

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQuestion.correct_option;
    setIsCorrect(correct);
    setShowFeedback(true);

    const newResponse = {
      q_id: currentQuestion._id,
      correct: correct,
    };
    setResponses((prev) => [...prev, newResponse]);
  };


  return (
    <div className="flex flex-col min-h-screen text-black dark:text-white">
      {/* Header */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <ProgressBar
          label="Progress"
          start={0}
          end={totalQuestions}
          current={currentIndex + 1}
        />
        <h1 className="text-2xl font-bold text-center mt-4">
          Question {currentIndex + 1}
        </h1>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 mt-4">
        <QuizQuestion
          question={currentQuestion.question}
          options={currentQuestion.options}
          name={`quiz-q-${currentIndex}`}
          selectedOption={selectedOption}
          onSelect={handleOptionClick}
          type={currentQuestion.type}
        />


        {/* Controls + Feedback fixed at bottom */}
        <div className="fixed bottom-0 left-0 w-full">
          {showFeedback && (
            <div
              className={`w-full py-4 text-center text-lg font-semibold
        ${isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
            >
              {isCorrect ? (
                <p>✅ Correct!</p>
              ) : (
                <p>
                  ❌ Incorrect. Correct Answer:{' '}
                  <span className="underline">
                    {formatOption(currentQuestion.correct_option, currentQuestion.type)}
                  </span>
                </p>
              )}
            </div>
          )}

          <button
            onClick={showFeedback ? handleNext : handleCheckAnswer}
            disabled={!selectedOption && !showFeedback}
            className={`w-full px-6 py-4 text-lg font-bold transition-all
      ${showFeedback
                ? isCorrect
                  ? 'bg-green-700 text-white'
                  : 'bg-red-700 text-white'
                : selectedOption
                  ? 'bg-[#FF5274] dark:bg-[#F66538] text-white hover:opacity-90'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            {currentIndex === totalQuestions - 1 && showFeedback
              ? 'Finish'
              : showFeedback
                ? 'Next'
                : 'Check'}
          </button>
        </div>



      </div>
    </div>
  );
}
