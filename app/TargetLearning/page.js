'use client';

import { useEffect, useState } from 'react';
import ExampleQuiz from '../common_components/ExampleQuiz';
import AdaptiveQuizPageContent from '../common_components/AdaptiveQuiz';
import { useRouter } from 'next/navigation';

export default function TargetLearning() {
  const router = useRouter();
  const [phase, setPhase] = useState("KANJI_EXAMPLES");
  const [kanjiExamples, setKanjiExamples] = useState([]);
  const [kanjiQuestions, setKanjiQuestions] = useState([]);
  const [vocabExamples, setVocabExamples] = useState([]);
  const [vocabQuestions, setVocabQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allResponses, setAllResponses] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("adaptive_quiz");
    if (!raw) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const items = Object.values(parsed.sets_data || {}).flat();

      const kanjiEx = items.filter(i => i.type === "example" && (i.kanji || i.onyomi || i.kunyomi));
      const vocabEx = items.filter(i => i.type === "example" && (i.word || i.furigana));

      const kanjiQ = items.filter(i => i.type === "question" && i.kanji);
      const vocabQ = items.filter(i => i.type === "question" && i.vocab);

      setKanjiExamples(kanjiEx);
      setVocabExamples(vocabEx);
      setKanjiQuestions(kanjiQ);
      setVocabQuestions(vocabQ);
    } catch (err) {
      console.error("Failed to parse adaptive_quiz", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextPhase = (phaseResponses = []) => {
    if (phaseResponses.length > 0) {
      setAllResponses(prev => [...prev, ...phaseResponses]);
    }

    if (phase === "KANJI_EXAMPLES") setPhase("KANJI_QUESTIONS");
    else if (phase === "KANJI_QUESTIONS") setPhase("VOCAB_EXAMPLES");
    else if (phase === "VOCAB_EXAMPLES") setPhase("VOCAB_QUESTIONS");
    else if (phase === "VOCAB_QUESTIONS") {
      const finalCombinedResponses = [...allResponses, ...phaseResponses];

      localStorage.setItem(
        'adaptive_quiz_responses',
        JSON.stringify({ responses: finalCombinedResponses })
      );
      
      router.push("/PostQuiz");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading quiz...</p>;

  if (phase === "KANJI_EXAMPLES")
    return <ExampleQuiz data={kanjiExamples} onComplete={nextPhase} />;
  
  if (phase === "KANJI_QUESTIONS")
    return <AdaptiveQuizPageContent data={kanjiQuestions} onComplete={nextPhase} />;

  if (phase === "VOCAB_EXAMPLES")
    return <ExampleQuiz data={vocabExamples} onComplete={nextPhase} />;

  if (phase === "VOCAB_QUESTIONS")
    return <AdaptiveQuizPageContent data={vocabQuestions} onComplete={nextPhase} />;

  return null;
}