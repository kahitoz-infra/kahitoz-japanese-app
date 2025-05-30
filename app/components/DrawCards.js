"use client";
import { toRomaji } from "wanakana";
import "./Cards.css";
import Image from "next/image";
import { useState, useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function DrawCard({
    kanji,
    flipAudio,
    face,
    setFace,
    onBookmarkToggle,
    sound,
    onNext,
    onPrevious
}) {
    const [isBookmarking, setIsBookmarking] = useState(false);
    const canvasRef = useRef(null);

    const handleClear = () => {
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
        }
    };

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
            await onBookmarkToggle(kanji.uid, !kanji.marked);
        } catch (error) {
            console.error("Bookmark update error:", error);
        } finally {
            setIsBookmarking(false);
        }
    };

    return (
        <div className="flip-card" >
            <div className={`flip-card-inner ${face ? "" : "flipped"}`}>

                    <div className="flip-card-front">
                        <div className="fixed top-1 left-0 right-0 z-10">
                            <div className="flex justify-between items-center px-4">
                                <Image
                                    src="/icons/back.svg"
                                    alt="back"
                                    width={25}
                                    height={25}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPrevious();
                                    }}
                                />
                                <Image
                                    src="/icons/clear.svg"
                                    alt="clear"
                                    width={25}
                                    height={25}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClear();
                                    }}
                                />
                                <Image
                                    src="/icons/next.svg"
                                    alt="next"
                                    width={25}
                                    height={25}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNext();
                                    }}
                                />
                            </div>
                        </div>

                        <ReactSketchCanvas
                            ref={canvasRef}
                            strokeWidth={7}
                            strokeColor={"white"}
                            width="100%"
                            height="100%"
                            canvasColor="black"
                            style={{ border: "none" }}
                        />

                        <div className="fixed bottom-1 w-full left-0 right-0">
                            <div className="flex justify-between items-center px-2">
                            <Image src={'/icons/rotate.svg'} alt="rotate" width={25} height={25} onClick={handleFlip}/>
                            <Image src={'/icons/save.svg'} alt="save" width={20} height={20} />

                            </div>
                        </div>


                </div>

                <div className="flip-card-back">
                    <p className="kanji-text">{kanji.kanji}</p>
                    <div
                        className={`fixed bottom-2 w-full left-0 px-2 z-10 hover:cursor-pointerw-full${isBookmarking ? "opacity-50" : ""}`}
                        
                    >
                        <div className="flex justify-between w-full">
                        <Image src={'/icons/rotate.svg'} alt="rotate" width={25} height={25} onClick={handleFlip}/>
                        <div onClick={handleBookmarkClick}>
                        {kanji.marked ? (
                            <Image src="/icons/bookmarked.svg" alt="bookmarked" width={20} height={30} />
                        ) : (
                            <Image src="/icons/bookmark.svg" alt="bookmark" width={20} height={30} />
                        )}

                        </div>
                        
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
