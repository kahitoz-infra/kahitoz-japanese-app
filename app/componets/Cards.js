"use client";
import { useState } from "react";
import { toRomaji } from "wanakana";
import "./Cards.css";

export default function KanjiCard({ kanji, flipAudio }) {
  const [face, setFace] = useState(true);

  const handleFlip = () => {
    if (flipAudio) {
      flipAudio.currentTime = 0;
      flipAudio.play();
    }
    setFace(!face);
  };

  return (
    <div className="flip-card" onClick={handleFlip}>
      <div className={`flip-card-inner ${face ? "" : "flipped"}`}>
        {/* Front (Kanji) */}
        <div className="flip-card-front">
          <p className="kanji-text">{kanji.kanji}</p>
        </div>

        {/* Back (Details) */}
        <div className="flip-card-back">
          <p className="text-2xl text-center">
            Onyomi: {JSON.parse(kanji.onyomi).join(", ")} ({toRomaji(JSON.parse(kanji.onyomi).join(""))})
          </p>
          <p className="text-2xl text-center">
            Kunyomi: {JSON.parse(kanji.kunyomi).join(", ")} ({toRomaji(JSON.parse(kanji.kunyomi).join(""))})
          </p>
          <p className="text-2xl text-center">Meaning: {kanji.english}</p>
        </div>
      </div>
    </div>
  );
}
