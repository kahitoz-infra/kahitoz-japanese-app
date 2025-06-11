"use client";
import { toRomaji, toHiragana } from "wanakana";
import "./Cards.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { authFetch } from "../middleware";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export default function VocabCard({
  vocab,
  flipAudio,
  face,
  setFace,
  onBookmarkToggle,
  sound,
  readingLoading,
  setReadingLoading,
}) {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [casualReadings, setCasualReadings] = useState([]);

  const formalReading = vocab.furigana;
  const formalRomaji = toRomaji(formalReading);
  const hiraganaReading = toHiragana(vocab.furigana || "");

  useEffect(() => {
    if (!vocab.word || !formalReading) return;

    const cacheKey = `readings_${vocab.word}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");

    const useCache =
      cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.data;

      const applyCasualReadings = (arr) => {
        const clean = arr.map((r) => ({
          reading: r,
          romaji: toRomaji(r),
        }));
        setCasualReadings(clean);
        setReadingLoading(false);
      };
      

    if (useCache) {
      applyCasualReadings(cached.data);
      return;
    }

    (async () => {
      try {
        const res = await authFetch(
          `${API_URL}/readings?word=${encodeURIComponent(
            vocab.word
          )}&formal=${encodeURIComponent(formalReading)}`
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { readings } = await res.json();
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: readings })
        );
        applyCasualReadings(readings);
      } catch (err) {
        console.error("Reading fetch failed:", err);
        setReadingLoading(false);
      }
    })();
  }, [vocab.word, formalReading, setReadingLoading]);

  const handleFlip = () => {
    if (sound && flipAudio) {
      flipAudio.currentTime = 0;
      flipAudio.play();
    }
    setFace(!face);
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      await onBookmarkToggle(vocab.uid, !vocab.marked);
    } catch (error) {
      console.error("Bookmark update error:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="flip-card" onClick={handleFlip}>
      <div className={`flip-card-inner ${face ? "" : "flipped"}`}>
        {/* FRONT SIDE */}
        <div className="flip-card-front">
          <p className="lg:text-8xl text-6xl font-bold">{vocab.word}</p>

          {/* Formal reading and romaji */}
          <div className="mt-2 text-center">
          <p className="text-xl text-gray-400">
              {hiraganaReading} 
          </p>
          
          <p className="text-md text-gray-600 italic">{formalRomaji}</p>

          </div>

          {/* Bookmark Icon */}
          <div
            className={`fixed bottom-2 right-2 z-10 hover:cursor-pointer ${
              isBookmarking ? "opacity-50" : ""
            }`}
            onClick={handleBookmarkClick}
          >
            {vocab.marked ? (
              <Image src="/icons/bookmarked.svg" alt="bookmarked" width={20} height={30} />
            ) : (
              <Image src="/icons/bookmark.svg" alt="bookmark" width={20} height={30} />
            )}
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="flip-card-back flex flex-col items-center">
          <p className="text-lg text-center mt-2">Kanji Type - {vocab.kanji_type}</p>
          <p className="text-2xl text-center mt-1">Meaning: {vocab.meaning}</p>

          {/* Scrollable casual readings */}
          <div className="mt-4 overflow-y-auto max-h-48 px-4 w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <p className="text-center text-md font-bold mb-2">Other Readings:</p>

            {readingLoading ? (
              <div className="flex justify-center mt-2">
                <Image
                  src="/icons/loading.svg"
                  alt="loading"
                  width={25}
                  height={25}
                  className="animate-spin"
                />
              </div>
            ) : casualReadings.length > 0 ? (
              casualReadings.map(({ reading, romaji }) => (
                <div key={reading} className="mb-2">
                  <p className="text-lg text-gray-400">{reading}</p>
                  <p className="text-sm text-gray-600 italic">{romaji}</p>
                </div>
              ))              
            ) : (
              <p className="text-gray-400 italic text-sm text-center">
                No casual readings found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
