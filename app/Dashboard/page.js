"use client";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

const Dashboard = () => {
    const username = "John";
    const quote = "Be better.";

    const boxes = [
        { label: "View Kanji", href: "/ViewKanji", image: "/pinkbg.webp", icon: "/icons/option1.svg", progress: 70 },
        { label: "Box 2", image: "/pinkbg.webp", icon: "/icons/option2.svg", progress: 45 },
        { label: "Box 3", image: "/pinkbg.webp", icon: "/icons/option3.svg", progress: 20 },
        { label: "Box 4", image: "/pinkbg.webp", icon: "/icons/option4.svg", progress: 90 },
        { label: "Box 5", image: "/pinkbg.webp", icon: "/icons/option5.svg", progress: 55 },
        { label: "Box 6", image: "/pinkbg.webp", icon: "/icons/option6.svg", progress: 30 },
        { label: "Box 7", image: "/pinkbg.webp", icon: "/icons/option7.svg", progress: 80 },
    ];

    return (
        <>
            <div className="flex flex-col min-h-screen pb-24 px-4 pt-16 dark:text-white text-black relative">
                {/* Profile and Greeting */}
                <div className="flex items-center gap-4 mt-2 ml-2">
                    <Image
                        src="/icons/profile.svg"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full border border-gray-300 shadow-sm"
                    />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Hi {username} 👋</h1>
                        <p className="text-sm sm:text-base mt-1">{quote}</p>
                    </div>
                </div>

                {/* LET'S GET STARTED Heading */}
                <div className="mt-8 px-2 text-center">
                    <h2 className="text-lg sm:text-xl font-semibold uppercase">Let's Get Started</h2>
                    <div className="flex justify-center mt-1">
                        <div className="h-1 w-20 rounded-full bg-[#EFA9B8]"></div>
                    </div>
                </div>

                {/* Grid of Boxes */}
                <div className="flex justify-center mt-6 px-2">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-12">
                        {boxes.map((box, idx) => {
                            const isLastOddBox = boxes.length % 2 !== 0 && idx === boxes.length - 1;

                            const BoxContent = (
                                <div className="flex flex-col items-center space-y-4">
                                    {/* Box */}
                                    <div className="relative w-[150px] h-[170px] sm:w-[170px] sm:h-[190px] rounded-xl overflow-hidden border-[2.5px] border-[#EFA9B8] shadow-md flex items-center justify-center">
                                        {/* Background */}
                                        <Image
                                            src={box.image}
                                            alt={box.label}
                                            fill
                                            className="object-cover blur-sm"
                                        />

                                        {/* Glass Overlay */}
                                        <div className="absolute inset-0 bg-white/0 backdrop-blur-md z-10" />

                                        {/* Circle with Icon */}
                                        <div className="z-20 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full bg-white border-[2.5px] border-[#f9f6ee] shadow-[0_0.5px_2px_rgba(0,0,0,0.25)] flex items-center justify-center">
                                            <Image
                                                src={box.icon}
                                                alt={`${box.label} Icon`}
                                                width={48}
                                                height={48}
                                                className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-[80%] h-[8px] rounded-full overflow-hidden bg-pink-100/40 dark:bg-pink-900/40 relative">
                                        {/* Light mode: black bar */}
                                        <div
                                            className="h-full bg-black transition-all duration-500 dark:hidden"
                                            style={{ width: `${box.progress}%` }}
                                        />
                                        {/* Dark mode: white bar */}
                                        <div
                                            className="h-full bg-white transition-all duration-500 hidden dark:block"
                                            style={{ width: `${box.progress}%` }}
                                        />
                                    </div>
                                </div>
                            );

                            const wrapperClass = isLastOddBox ? "col-span-2 flex justify-center" : "";

                            return box.href ? (
                                <Link key={idx} href={box.href} className={wrapperClass}>
                                    {BoxContent}
                                </Link>
                            ) : (
                                <div key={idx} className={wrapperClass}>
                                    {BoxContent}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Navbar */}
            <div className="fixed bottom-0 left-0 right-0 z-30">
                <Navbar />
            </div>
        </>
    );
};

export default Dashboard;
