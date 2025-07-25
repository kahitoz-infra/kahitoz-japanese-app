'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SetBlock from './SetBlock';
import { authFetch } from '../../middleware';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const set_api = process.env.NEXT_PUBLIC_API_LEARN + "/all_sets";

export default function SetsPageContent() {
  const searchParams = useSearchParams();
  const quizName = searchParams.get('quiz_name');
  const quizType = searchParams.get('quiz_type');

  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSets = async () => {
      if (!quizName || !quizType) {
        setError("Missing quiz parameters");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await authFetch(`${set_api}?quiz_name=${quizName}&quiz_type=${quizType}`);
        const data = await res.json();

        if (!res.ok || !data.sets) {
          setError(data.detail || 'No sets found');
          setSets([]);
        } else {
          setSets(data.sets);
        }
      } catch (err) {
        console.error("Failed to fetch sets:", err);
        setError("Something went wrong while fetching sets.");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [quizName, quizType]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#333333] text-black dark:text-white relative">
      {/* Header */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl flex items-center justify-center relative z-0">
        <h1 className="text-2xl font-bold text-center z-10">
          {quizName
            ?.replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase())}{" "}
          - Sets
        </h1>
      </div>

      {/* Back Link */}
      <div className="p-4">
        <Link
          href="/"
          className="text-[#FF3A60] dark:text-white font-semibold hover:underline text-lg"
        >
          &lt; Back
        </Link>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <Image
            src="/icons/loading.svg"
            alt="Loading"
            width={40}
            height={40}
            className="animate-spin"
          />
        </div>
      )}

      {/* Error Message */}
      {!loading && error && (
        <div className="text-center text-red-500 mt-6">{error}</div>
      )}

      {/* Sets Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 max-w-4xl mx-auto px-6 py-8">
          {sets.map((set, index) => (
            <SetBlock
              key={index}
              setNo={parseInt(set.set_key.replace("set", ""))}
              status={
                set.completed
                  ? "completed"
                  : set.quiz_score
                  ? "attempted"
                  : "not attempted"
              }
              score={set.quiz_score ? `${set.quiz_score}/30` : null}
              lastAttempted={set.last_attempted}
              type={quizType}
              quiz_number={quizName.charAt(quizName.length - 1)}
              onClick={() => {
                console.log("Start quiz for", set.set_key);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
