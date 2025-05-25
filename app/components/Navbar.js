'use client';
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const items = [
        { label: "Home", lightIcon: "/home.png", darkIcon: "/homewhite.png" },
        { label: "Chat", lightIcon: "/chat.png", darkIcon: "/chat_white.png" },
        { label: "Streak", lightIcon: "/calendar.png", darkIcon: "/calendar_white.png" },
        { label: "Profile", lightIcon: "/user.png", darkIcon: "/user_white.png" },
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
                            <Image
                                src={theme === "dark" ? item.darkIcon : item.lightIcon}
                                alt={item.label}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <p className="text-xs mt-1">{item.label}</p>
                        </li>
                    </div>
                ))}
            </ul>
        </nav>
    );
}
