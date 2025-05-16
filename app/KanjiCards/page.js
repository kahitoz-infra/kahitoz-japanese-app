"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import KanjiCard from "../componets/Cards";
import "./page.css";
import Image from "next/image";
export default function KanjiCards() {
  const [label, setLabel] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [kanjiList, setKanjiList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [labelLoad, setLabelLoad] = useState(true);

  const flipAudio = typeof Audio !== "undefined" ? new Audio("/sounds/flipcard.mp3") : null;
  const turnAudio = typeof Audio !== "undefined" ? new Audio("/sounds/pageturn.mp3") : null;

  // Load labels (tags)
  useEffect(() => {
    const fetchLabels = async () => {
      const response = await fetch(`https://apizenkanji.kahitoz.com/v1/tags`);
      const data = await response.json();
      setLabel(data.result);
      setLabelLoad(false);
    };
    fetchLabels();
  }, []);

  // Load kanji data when label changes
  useEffect(() => {
    const fetchKanji = async () => {
      if (selectedLabel) {
        const response = await fetch(`https://apizenkanji.kahitoz.com/v1/get_kanji?label=${selectedLabel}`);
        const data = await response.json();
        setKanjiList(data);
        setCurrentIndex(0);
      }
    };
    fetchKanji();
  }, [selectedLabel]);

  const handleLabelChange = (e) => {
    setSelectedLabel(e.target.value);
  };

  const handleNext = () => {
    if (turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % kanjiList.length);
  };

  const handlePrevious = () => {
    if (turnAudio) {
      turnAudio.currentTime = 0;
      turnAudio.play();
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + kanjiList.length) % kanjiList.length);
  };

  const currentKanji = kanjiList[currentIndex];

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="fixed top-0 left-0 right-0 z-10 gap-x-2 p-6 mt-2">
        <div className="flex w-full justify-between">
          <Link href="/" passHref>
            <Image src={'icons/back.svg'} width={40} height={40} alt="back" />
          </Link>

          <select
            value={selectedLabel}
            onChange={handleLabelChange}
            className="p-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="">Select a label</option>
            {!labelLoad &&
              label.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        {kanjiList.length > 0 && currentKanji ? (
          <>
            <p className="text-white text-xl mb-4 mt-4">
              {currentIndex + 1} / {kanjiList.length}
            </p>

            <KanjiCard kanji={currentKanji} flipAudio={flipAudio} />

            <div className="hidden lg:flex gap-x-10 mt-4">
              <button onClick={handlePrevious} className="p-2 bg-green-500 text-white rounded-lg">⬅️ Previous</button>
              <button onClick={handleNext} className="p-2 bg-green-500 text-white rounded-lg">Next ➡️</button>
            </div>
          </>
        ) : (
          <p className="text-white mt-8">Please select a label to load kanji cards.</p>
        )}
      </div>
    </div>
  );
}
