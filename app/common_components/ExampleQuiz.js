'use client';

import { useEffect, useState } from 'react';

export default function ExampleQuiz({ onComplete }) {
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState('');
  const [currentSetName, setCurrentSetName] = useState('');

  useEffect(() => {
    const loadExamples = () => {
      const rawData = localStorage.getItem('current_set_quiz');
      const phaseData = localStorage.getItem('current_phase');
      if (!rawData || !phaseData) {
        onComplete();
        return;
      }

      try {
        const parsed = JSON.parse(rawData);
        const { phase } = JSON.parse(phaseData);
        const setData = parsed.set_data || [];
        
        setCurrentPhase(phase);
        setCurrentSetName(parsed.current_set || '');

        const filteredExamples = setData
          .filter(item => item.type === 'example')
          .filter(item => {
            if (phase === 'kanji') {
              return item.kanji && (item.onyomi || item.kunyomi);
            } else {
              return item.word && item.furigana;
            }
          });

        setExamples(filteredExamples);
      } catch (err) {
        console.error('Error loading examples:', err);
        onComplete();
      } finally {
        setLoading(false);
      }
    };

    loadExamples();
  }, [onComplete]);

  const getCurrentExample = () => {
    return examples[currentExampleIndex];
  };

  const handleNext = () => {
    if (currentExampleIndex === examples.length - 1) {
      onComplete();
    } else {
      setCurrentExampleIndex(prev => prev + 1);
    }
  };

  const renderKanjiExample = (example) => {
    const kanji = example.kanji;
    const selected = example.reading;

    // Create options from onyomi and kunyomi
    const options = [];
    if (example.onyomi?.length) {
      options.push(...example.onyomi.map((r) => ({ value: r, label: `Onyomi: ${r}` })));
    }
    if (example.kunyomi?.length) {
      options.push(...example.kunyomi.map((r) => ({ value: r, label: `Kunyomi: ${r}` })));
    }

    return (
      <>
        <p className="text-center text-lg font-medium mb-4">
          <span className="font-bold">Kanji:</span> <span className="text-3xl">{kanji}</span>
        </p>

        <div className="text-base md:text-lg leading-relaxed mb-4">
          <p><span className="font-bold">Sentence:</span> {example.sentence}</p>
          <p><span className="font-bold">Hiragana:</span> {example.sentence_hiragana}</p>
          <p><span className="font-bold">Translation:</span> {example.translation}</p>
          {example.explanation && (
            <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-200">
              💡 {example.explanation}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`p-3 rounded border font-medium ${
                opt.value === selected
                  ? 'bg-green-200 border-green-500 dark:bg-green-700 dark:border-green-400 text-black dark:text-white'
                  : 'bg-gray-100 border-gray-300 dark:bg-[#333333] dark:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderVocabExample = (example) => {
    return (
      <>
        <p className="text-center text-lg font-medium mb-4">
          <span className="font-bold">Word:</span> <span className="text-2xl">{example.word}</span>
        </p>
        
        <p className="text-center text-lg font-medium mb-4">
          <span className="font-bold">Reading:</span> <span className="text-xl">{example.furigana}</span>
        </p>

        <div className="text-base md:text-lg leading-relaxed mb-4">
          <p><span className="font-bold">Sentence:</span> {example.sentence}</p>
          <p><span className="font-bold">Hiragana:</span> {example.furigana}</p>
          <p><span className="font-bold">Translation:</span> {example.translation}</p>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-bold">Vocabulary Focus:</span> This example demonstrates the usage of <strong>{example.word}</strong> ({example.furigana}) in context.
          </p>
        </div>
      </>
    );
  };

  if (loading) return <p className="p-4 text-center">Loading examples...</p>;
  
  const example = getCurrentExample();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-10 pb-40 text-black dark:text-white">
      {/* Header */}
      <div className="w-full max-w-xl text-center mb-6">
        <h1 className="font-bold text-2xl mb-2">
          {currentSetName.toUpperCase()} - Sample Questions
        </h1>
        <h2 className="font-medium text-lg mb-2">
          {currentPhase === 'kanji' ? 'Kanji Examples' : 'Vocabulary Examples'}
        </h2>
      </div>

      {/* Example Content */}
      <div className="w-full max-w-xl rounded-xl shadow-md border border-[#FF5274] dark:border-[#F66538] bg-white dark:bg-[#2F2F2F] p-6">
        {currentPhase === 'kanji' ? renderKanjiExample(example) : renderVocabExample(example)}
      </div>

      {/* Navigation Button */}
      <button
        onClick={handleNext}
        className="fixed bottom-4 w-[90%] max-w-xl px-6 py-4 text-lg font-bold rounded-lg bg-[#FF5274] dark:bg-[#F66538] text-white hover:opacity-90 transition-all"
      >
        {currentExampleIndex === examples.length - 1 ? 'Start Quiz' : 'Next'}
      </button>
    </div>
  );
}