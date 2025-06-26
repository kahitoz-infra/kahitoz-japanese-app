'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const items = [
        { lightIcon: "/icons/learn.svg", darkIcon: "/icons/learnwhite.svg", label: "Learn", path: "/ViewAll" },
        { lightIcon: "/icons/progress.svg", darkIcon: "/icons/progresswhite.svg", label: "Quiz", path: "/PreQuiz" },
        { lightIcon: "/icons/chat.svg", darkIcon: "/icons/chatwhite.svg", label: "AI Chat", path: "/Chat" },
        { lightIcon: "/icons/profile.svg", darkIcon: "/icons/profilewhite.svg", label: "Profile", path: "/Settings" },
    ];

    const centerButton = {
        lightIcon: "/icons/home.svg",
        darkIcon: "/icons/home.svg",
        label: "HOME",
        path: "/Dashboard"
    };

    const navItems = [items[0], items[1], centerButton, items[2], items[3]];

    if (!mounted) return null;

    return (
        <nav className="w-full fixed bottom-0 left-0 bg-[#FFFFFF] dark:bg-[#353839] border-t-[3px] border-[#FF5274] dark:border-[#F66538] z-50 rounded-t-3xl">
            <ul className="relative flex justify-between items-center px-4 py-6 rounded-t-[20px]">
                {navItems.map((item, index) => {
                    const isCenter = index === 2;

                    const handleClick = () => {
                        if (item.path) {
                            router.push(item.path);
                        }
                    };

                    return (
                        <li
                            key={index}
                            onClick={handleClick}
                            className="flex flex-col items-center justify-center w-full relative cursor-pointer"
                        >
                            {isCenter ? (
                                <div className="flex flex-col items-center absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="bg-[#FF5274] dark:bg-[#F66538] rounded-full w-20 h-20 flex items-center justify-center shadow-md">
                                        <Image
                                            src={item.lightIcon}
                                            alt={`${item.label} Light`}
                                            width={28}
                                            height={28}
                                            className="block dark:hidden object-contain"
                                        />
                                        <Image
                                            src={item.darkIcon}
                                            alt={`${item.label} Dark`}
                                            width={28}
                                            height={28}
                                            className="hidden dark:block object-contain"
                                        />
                                    </div>
                                    <p className="text-xs mt-1 text-gray-800 dark:text-white">{item.label}</p>
                                </div>
                            ) : (
                                <>
                                    <Image
                                        src={item.lightIcon}
                                        alt={`${item.label} Light`}
                                        width={24}
                                        height={24}
                                        className="block dark:hidden object-contain"
                                    />
                                    <Image
                                        src={item.darkIcon}
                                        alt={`${item.label} Dark`}
                                        width={24}
                                        height={24}
                                        className="hidden dark:block object-contain"
                                    />
                                    <p className="text-xs mt-1 text-gray-800 dark:text-white">{item.label}</p>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
