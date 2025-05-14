"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { toRomaji } from "wanakana";
import './page.css';

export default function KanjiCards() {
    const [face, setFace] = useState(true);
    const [label, setLabel] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [kanjiList, setKanjiList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [label_load, set_label_load] = useState(true);
    const [cardDirection, setCardDirection] = useState("next");


    const flipAudio = typeof Audio !== "undefined" ? new Audio('/sounds/flipcard.mp3') : null;

    const TurnAudio = typeof Audio !== "undefined" ? new Audio('/sounds/pageturn.mp3') : null;




    const handleFlip = () => {
        if (flipAudio) {
            flipAudio.currentTime = 0;
            flipAudio.play();
        }
        setFace(!face);
    };

    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;

        const distance = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            // Swipe left → Next
            handleNext();
        } else if (distance < -minSwipeDistance) {
            // Swipe right → Previous
            handlePrevious();
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };



    // Load labels (tags)
    useEffect(() => {
        const get_label = async () => {
            const get_tags = await fetch(`https://apizenkanji.kahitoz.com/v1/tags`);
            let raw_tags = await get_tags.json();
            setLabel(raw_tags['result']);
            set_label_load(false);
        };
        get_label();
    }, []);

    // Load kanji data when label changes
    useEffect(() => {
        const get_data = async () => {
            if (selectedLabel) {
                let raw_kanji = await fetch(`https://apizenkanji.kahitoz.com/v1/get_kanji?label=${selectedLabel}`);
                let raw_data = await raw_kanji.json();
                setKanjiList(raw_data);
                setCurrentIndex(0);
                setFace(true);
            }
        };
        get_data();
    }, [selectedLabel]);

    const handleLabelChange = (event) => {
        setSelectedLabel(event.target.value);
    };

    const handleNext = () => {
        if (TurnAudio) {
            TurnAudio.currentTime = 0;
            TurnAudio.play();
        }
        setFace(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % kanjiList.length);
    };

    const handlePrevious = () => {
        if (TurnAudio) {
            TurnAudio.currentTime = 0;
            TurnAudio.play();
        }
        setFace(true);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + kanjiList.length) % kanjiList.length);
    };

    const currentKanji = kanjiList[currentIndex];

    return (
        <div className={'flex flex-col h-screen w-screen'}>
            <div className="fixed top-0 left-0 right-0 z-10 h-8 bg-black"></div>
            <div className={'fixed top-0 left-0 right-0 z-10 gap-x-2 p-6 mt-4'}>
                <div className={'flex w-full justify-between'}>
                    <Link href="/" passHref>
                        <button className={'bg-blue-500 text-white p-2 rounded-lg '}>
                            back
                        </button>
                    </Link>
                    <select
                        value={selectedLabel}
                        onChange={handleLabelChange}
                        className="p-2 border border-gray-300 rounded-lg text-black"
                    >
                        <option value="">Select a label</option>
                        {!label_load &&
                            label.map((tag, index) => (
                                <option key={index} value={tag}>
                                    {tag}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className={'flex flex-col items-center justify-center h-full'}>
                {kanjiList.length > 0 && currentKanji &&
                    <>
                        {/* Count above card */}
                        <p className="text-white text-xl mb-4 mt-4">
                            {currentIndex + 1} / {kanjiList.length}
                        </p>

                        <div
                            className="flip-card"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={handleFlip}
                        >

                        <div className={`flip-card-inner ${face ? '' : 'flipped'}`}>
                                {/* Front (Kanji) */}
                                <div className="flip-card-front">
                                    <p className="kanji-text">{currentKanji.kanji}</p>
                                </div>

                                {/* Back (Details) */}
                                <div className="flip-card-back">
                                    <p className="text-2xl text-center">
                                        Onyomi: {JSON.parse(currentKanji.onyomi).join(", ")} ({toRomaji(JSON.parse(currentKanji.onyomi).join(""))})
                                    </p>
                                    <p className="text-2xl text-center">
                                        Kunyomi: {JSON.parse(currentKanji.kunyomi).join(", ")} ({toRomaji(JSON.parse(currentKanji.kunyomi).join(""))})
                                    </p>
                                    <p className="text-2xl text-center">Meaning: {currentKanji.english}</p>
                                </div>
                            </div>
                        </div>


                        {/* Arrow Buttons */}
                        <div className={'hidden lg:flex gap-x-10 mt-4'}>
                            <button onClick={handlePrevious} className={'p-2 bg-green-500 text-white rounded-lg'}>⬅️ Previous</button>
                            <button onClick={handleNext} className={'p-2 bg-green-500 text-white rounded-lg'}>Next ➡️</button>
                        </div>
                    </>
                }

                {kanjiList.length === 0 && <p className={'text-white mt-8'}>Please select a label to load kanji cards.</p>}
            </div>


            <div className={'h-20 flex items-center justify-center '}>
                <div className={'p-2 bg-blue-500 w-30 h-10 hover:cursor-pointer rounded-xl'}>
                    <p className={'text-center'}>🤖 Ask AI</p>
                </div>
            </div>
        </div>
    );
}
