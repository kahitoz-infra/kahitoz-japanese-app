"use client";
import { toRomaji } from "wanakana";
import "./Cards.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

export default function VocabCard({ vocab, flipAudio, face, setFace, onBookmarkToggle, sound }) {
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [hiragana, setHiragana] = useState("");
  const [romaji, setRomaji] = useState("");
  const [kuroshiro, setKuroshiro] = useState(null);

  const handleFlip = () => {
    if (sound && flipAudio) {
      flipAudio.currentTime = 0;
      flipAudio.play();
    }
    setFace(!face);
  };

  useEffect(() => {
    const initKuroshiro = async () => {
      const k = new Kuroshiro();
      await k.init(new KuromojiAnalyzer({ dictPath: "/kuromoji/dict/" }));
      setKuroshiro(k);
    };
    initKuroshiro();
  }, []);

  useEffect(() => {
    if (kuroshiro && vocab.word) {
      kuroshiro.convert(vocab.word, { to: "hiragana" }).then((result) => {
        setHiragana(result);
        setRomaji(toRomaji(result));
      });
    }
  }, [kuroshiro, vocab.word]);

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
          <p className="text-xl text-center mt-2 text-gray-600">
            {hiragana || "Loading..."}
          </p>
          <p className="text-md text-center mt-1 text-gray-400 italic">
            {romaji}
          </p>

          <div
            className={`fixed bottom-2 right-2 z-10 hover:cursor-pointer ${isBookmarking ? 'opacity-50' : ''}`}
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
        <div className="flip-card-back">
          <p className="text-lg text-center">
            Kanji Type - {vocab.kanji_type}
          </p>
          <p className="text-2xl text-center mt-2">
            Meaning: {vocab.meaning}
          </p>
        </div>
      </div>
    </div>
  );
}
