"use client"
import Link from 'next/link';
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

const Dashboard = () => {
    return (
        <>
            <div className="flex items-center justify-center  p-4">
                <div className="fixed top-0 left-0 right-0 z-10 gap-x-2 p-6 mt-2 ">
                <div className="flex flex-col gap-y-4">

                    <div className="flex items-center justify-center">
                        <Link href="/KanjiCards" className={'flex items-center justify-center w-full'}>


                                <div className=" flex flex-col items-center justify-center p-4 w-full border border-cyan-600 rounded-xl shadow-lg shadow-cyan-500 font-bold text-xl cursor-pointer">
                                    <div className="relative w-full h-16 flex items-center">
                                        {/* Icon on the far left */}
                                        <div className="absolute left-0 pl-2">
                                            <Image src="/icons/viewkanji.svg" alt="viewkanji" width={60} height={60} />
                                        </div>

                                        {/* Centered text */}
                                        <div className="w-full text-center text-xl font-semibold">
                                            View Kanji
                                        </div>
                                    </div>
                                    <div className={'text-sm flex flex-col gap-y-2'}>
                                        <p>📚 Learn Kanji from N5 to N1 effortlessly using interactive flashcards or a structured table view.</p>
                                        <p>🔖 Bookmark the Kanji you find challenging to review them later and track your progress with ease!</p>

                                    </div>
                                </div>

                        </Link>
                    </div>

                    <div className="flex items-center justify-center">
                        <Link href="/KanjiVocab" className={'flex items-center justify-center w-full'}>


                            <div className=" flex flex-col items-center justify-center p-4 w-full border border-cyan-600 rounded-xl shadow-lg shadow-cyan-500 font-bold text-xl cursor-pointer">
                                <div className="relative w-full h-16 flex items-center">
                                    {/* Icon on the far left */}
                                    <div className="absolute left-0 pl-2">
                                        <Image src="/icons/words.svg" alt="words" width={60} height={60} />
                                    </div>

                                    {/* Centered text */}
                                    <div className="w-full text-center text-xl font-semibold">
                                        View Vocabulary
                                    </div>
                                </div>
                                <div className={'text-sm flex flex-col gap-y-2'}>

                                    <p>🗣️ <strong>Expand Your Japanese Vocabulary</strong> with curated word lists for each JLPT level, supported by quizzes and spaced repetition.</p>
                                    <p>📌 Save difficult words to your personal list for focused practice whenever you need it.</p>

                                </div>
                            </div>

                        </Link>
                    </div>

                    <div className="flex items-center justify-center">
                        <Link href="/KanjiVocab" className={'flex items-center justify-center w-full'}>


                            <div className=" flex flex-col items-center justify-center p-4 w-full border border-cyan-600 rounded-xl shadow-lg shadow-cyan-500 font-bold text-xl cursor-pointer">
                                <div className="relative w-full h-16 flex items-center">
                                    {/* Icon on the far left */}
                                    <div className="absolute left-0 pl-2">
                                        <Image src="/icons/paragraph.svg" alt="words" width={60} height={60} />
                                    </div>

                                    {/* Centered text */}
                                    <div className="w-full text-center text-xl font-semibold">
                                        Paragraph reading
                                    </div>
                                </div>
                                <div className={'text-sm flex flex-col gap-y-2'}>

                                    <p>📖 <strong>Improve your Reading Skills</strong> with short, level-based Japanese passages designed for JLPT N5 to N1 learners.</p>
                                    <p>🧠 Learn words and Kanji in context, with built-in translations and explanations to help you understand every sentence.</p>


                                </div>
                            </div>

                        </Link>
                    </div>



                </div>
                    <footer>
                        <Navbar/>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default Dashboard;