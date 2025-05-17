"use client";
import { toRomaji } from "wanakana";
import "./Cards.css";
import Image from "next/image";

export default function KanjiCard({ kanji, flipAudio, face, setFace, onBookmarkToggle }) {
  const handleFlip = () => {
    if (flipAudio) {
      flipAudio.currentTime = 0;
      flipAudio.play();
    }
    setFace(!face);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmarkToggle(kanji.uid, !kanji.marked); // pass new status
  };

  return (
      <div className="flip-card" onClick={handleFlip}>
        <div className={`flip-card-inner ${face ? "" : "flipped"}`}>
          <div className="flip-card-front">
            <p className="kanji-text">{kanji.kanji}</p>

            <div
                className="fixed bottom-2 right-2 z-10 hover:cursor-pointer"
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
              {toRomaji(JSON.parse(kanji.onyomi).join(""))})
            </p>
            <p className="text-2xl text-center">
              Kunyomi: {JSON.parse(kanji.kunyomi).join(", ")} (
              {toRomaji(JSON.parse(kanji.kunyomi).join(""))})
            </p>
            <p className="text-2xl text-center">Meaning: {kanji.english}</p>
          </div>
        </div>
      </div>
  );
}
