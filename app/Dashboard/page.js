"use client";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";
import Link from "next/link";

const Dashboard = () => {
    const username = "John";
    const quote = "Be better.";

    const boxes = [
        { label: "View Kanji", href: "/ViewKanji", image: "/images/kanji-bg.jpg", icon: "/icons/kanji-icon.svg" },
        { label: "Box 1", image: "/images/sample1.jpg", icon: "/icons/sample-icon.svg" },
        { label: "Box 2", image: "/images/sample2.jpg", icon: "/icons/sample-icon.svg" },
        { label: "Box 3", image: "/images/sample3.jpg", icon: "/icons/sample-icon.svg" },
        { label: "Box 4", image: "/images/sample4.jpg", icon: "/icons/sample-icon.svg" },
        { label: "Box 5", image: "/images/sample5.jpg", icon: "/icons/sample-icon.svg" },
        { label: "Box 6", image: "/images/sample6.jpg", icon: "/icons/sample-icon.svg" },
    ];

    return (
        <>
            <div className="flex flex-col min-h-screen pb-20 px-4 pt-16 dark:text-white text-black relative">
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
                        <h1 className="text-2xl font-bold">Hi {username} 👋</h1>
                        <p className="text-sm mt-1">{quote}</p>
                    </div>
                </div>

                {/* LET'S GET STARTED Heading */}
                <div className="mt-8 px-2 text-center">
                    <h2 className="text-xl font-semibold uppercase">Let's Get Started</h2>
                    <div className="flex justify-center mt-1">
                        <div className="h-1 w-20 bg-[#F789A3] rounded-full"></div>
                    </div>
                </div>

                {/* 2x3 Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 px-2 place-items-center">
                    {boxes.map((box, idx) => {
                        const BoxContent = (
                            <div className="relative w-[170px] h-[190px] rounded-xl overflow-hidden border-[2.83px] border-[#F789A3] shadow-md">
                                {/* Background Blurred Image */}
                                <Image
                                    src={box.image}
                                    alt={box.label}
                                    fill
                                    className="object-cover blur-sm"
                                />

                                {/* Glassmorphic White Overlay */}
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-md z-10" />

                                {/* White Circle with Icon */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center">
                                    <Image
                                        src={box.icon}
                                        alt={`${box.label} Icon`}
                                        width={60}
                                        height={60}
                                    />
                                </div>
                            </div>
                        );

                        return box.href ? (
                            <Link key={idx} href={box.href}>{BoxContent}</Link>
                        ) : (
                            <div key={idx}>{BoxContent}</div>
                        );
                    })}
                </div>
            </div>

            {/* Fixed Bottom Navbar */}
            <div className="fixed bottom-0 left-0 right-0 z-30">
                <Navbar />
            </div>
        </>
    );
};

export default Dashboard;
