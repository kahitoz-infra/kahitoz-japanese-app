'use client';
import { authFetch } from "@/app/middleware";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const quiz_api = process.env.NEXT_PUBLIC_API_LEARN + "/all_quiz";


export default function CustomKanjiQuizBlock() {
  const [type, setType] = useState("kanji");
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetch_quiz_details = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`${quiz_api}?quiz_type=${type}`);
        const data = await res.json();

        const quizData = data[`${type}_quiz`] || {};
        const parsedQuizzes = Object.entries(quizData).map(([key, value]) => {
          const desc = value.description || {};
          const uidRanges = desc.uid_ranges || {};
          const levelInfo = Object.entries(uidRanges)
            .map(([level, range]) => `${level}: ${range}`)
            .join(", ");

          return {
            key,
            heading: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            notes: desc.notes || "—",
            level: levelInfo || "—",
            createdAt: value.created_at,
          };
        });

        setQuizzes(parsedQuizzes);
      } catch (err) {
        console.error("Failed to fetch quiz data:", err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetch_quiz_details();
  }, [type]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setLoading(true);
  };

  return (
    <div>
      {/* Type Switch Buttons */}
      <div className="flex w-full justify-center gap-x-4 items-center mb-4">
              <button
      className={`${
        type === 'kanji'
          ? 'bg-[#FFB8C6] dark:bg-[#FF9D7E]'
          : 'bg-white dark:bg-white'
      } text-black dark:text-black font-bold px-4 py-2 rounded-lg`}
      onClick={() => handleTypeChange('kanji')}
    >
      Kanji
    </button>
    <button
      className={`${
        type === 'vocab'
          ? 'bg-[#FFB8C6] dark:bg-[#FF9D7E]'
          : 'bg-white dark:bg-white'
      } text-black dark:text-black font-bold px-4 py-2 rounded-lg`}
      onClick={() => handleTypeChange('vocab')}
    >
      Vocab
    </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center">
          <Image src={'/icons/loading.svg'} alt="loading" width={40} height={40} className="animate-spin" />
        </div>
      )}

      {/* Quiz Cards */}
      {!loading && quizzes.length > 0 && quizzes.map((quiz) => (
        <div
          key={quiz.key}
          onClick={() => router.push(`/Sets?quiz_name=${encodeURIComponent(quiz.key)}&quiz_type=${type}`)}
          className="cursor-pointer rounded-2xl border border-gray-400 p-6 bg-white dark:bg-[#2C2C2C] shadow-md w-full max-w-xl mx-auto mb-4 hover:bg-gray-100 dark:hover:bg-[#333]"
        >
          <h1 className="text-lg text-gray-600 dark:text-gray-300 mb-2">Select Level</h1>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-3">{quiz.heading}</h2>
          <div className="text-gray-800 dark:text-gray-200 space-y-2">
            <p><span className="font-semibold">Notes:</span> {quiz.notes}</p>
            <p><span className="font-semibold">Level:</span> {quiz.level}</p>
            <p><span className="font-semibold">Created:</span> {new Date(quiz.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}

      {!loading && quizzes.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No quizzes found for this type.
        </div>
      )}
    </div>
  );
}
