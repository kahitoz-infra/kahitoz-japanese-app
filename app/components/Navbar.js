'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const items = [
        { label: "Home", lightIcon: "/icons/home.png", darkIcon: "/icons/homewhite.png" },
        { label: "Chat", lightIcon: "/icons/chat.png", darkIcon: "/icons/chatwhite.png" },
        { label: "Streak", lightIcon: "/icons/calendar.png", darkIcon: "/icons/calendarwhite.png" },
        { label: "Profile", lightIcon: "/icons/user.png", darkIcon: "/icons/userwhite.png" },
    ];

    if (!mounted) return null;

    return (
        <nav className="w-full fixed bottom-0 left-0 bg-[#FAF8F6] dark:bg-[#2F2F2F]">
            <ul className="flex justify-between items-center border-t-[3px] border-[#F4A7B9] rounded-t-[20px] px-2 py-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-center flex-1 relative">
                        {/* Separator */}
                        {index !== items.length - 1 && (
                            <span className="absolute right-0 top-2 bottom-2 w-px bg-gray-700 dark:bg-white opacity-60"></span>
                        )}

                        <li className="flex flex-col items-center justify-center w-full">
                            {/* Light icon */}
                            <Image
                                src={item.lightIcon}
                                alt={`${item.label} Light`}
                                width={24}
                                height={24}
                                className="block dark:hidden object-contain"
                            />
                            {/* Dark icon */}
                            <Image
                                src={item.darkIcon}
                                alt={`${item.label} Dark`}
                                width={24}
                                height={24}
                                className="hidden dark:block object-contain"
                            />
                            <p className="text-xs mt-1">{item.label}</p>
                        </li>
                    </div>
                ))}
            </ul>
        </nav>
    );
}
