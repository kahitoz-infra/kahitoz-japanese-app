"use client";
import { toRomaji } from "wanakana";
import "./Cards.css";
import Image from "next/image";
import {useState} from "react";

export default function KanjiCard({ kanji, flipAudio, face, setFace, onBookmarkToggle, sound }) {
  const [isBookmarking, setIsBookmarking] = useState(false);

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
      // Pass the current opposite of marked status as operation_type
      await onBookmarkToggle(kanji.uid, !kanji.marked);
    } catch (error) {
      console.error("Bookmark update error:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
      <div className="flip-card" onClick={handleFlip}>
        <div className={`flip-card-inner ${face ? "" : "flipped"}`}>
          <div className="flip-card-front">
            <p className="kanji-text">{kanji.kanji}</p>

            <div
                className={`fixed bottom-2 right-2 z-10 hover:cursor-pointer ${isBookmarking ? 'opacity-50' : ''}`}
                onClick={handleBookmarkClick}
            >
              {kanji.marked ? (
                  <Image src="/icons/bookmarked.svg" alt="bookmarked" width={20} height={30} />
              ) : (
                  <Image src="/icons/bookmark.svg" alt="bookmark" width={20} height={30} />
              )}
            </div>
          </div>

          <div className="flip-card-back">
            <p className="text-2xl text-center">
              Onyomi: {JSON.parse(kanji.onyomi).join(", ")} (
                {JSON.parse(kanji.onyomi).map(reading => toRomaji(reading)).join(", ")}
              )
            </p>
            <p className="text-2xl text-center">
              Kunyomi: {JSON.parse(kanji.kunyomi).join(", ")} (
                {JSON.parse(kanji.kunyomi).map(reading => toRomaji(reading)).join(", ")}
              )
            </p>

            <p className="text-2xl text-center">Meaning: {kanji.english}</p>
          </div>
        </div>
      </div>
  );
}