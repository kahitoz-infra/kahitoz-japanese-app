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
    { lightIcon: "/icons/progress.svg", darkIcon: "/icons/progresswhite.svg", label: "Quiz", path: "/CustomQuiz" },
    { lightIcon: "/icons/chat.svg", darkIcon: "/icons/chatwhite.svg", label: "AI Chat", path: "/Chat" },
    { lightIcon: "/icons/profile.svg", darkIcon: "/icons/profilewhite.svg", label: "Profile", path: "/Settings" },
  ];

  const centerButton = {
    lightIcon: "/icons/home.svg",
    darkIcon: "/icons/home.svg",
    path: "/Dashboardv2",
  };

  const navItems = [items[0], items[1], centerButton, items[2], items[3]];

  if (!mounted) return null;

  return (
    <nav className="w-full fixed bottom-0 inset-x-0 bg-white dark:bg-[#353839] border-t-[3px] border-[#FF5274] dark:border-[#F66538] z-50 rounded-t-3xl">
      <ul className="relative flex justify-between items-center h-[96px] sm:h-[104px] md:h-[110px] lg:h-[120px] px-4 rounded-t-[20px]">
        {navItems.map((item, index) => {
          const isCenter = index === 2;

          const handleClick = () => {
            if (item.path) router.push(item.path);
          };

          return (
            <li
              key={index}
              onClick={handleClick}
              className="flex flex-col items-center justify-center w-full relative cursor-pointer"
            >
              {isCenter ? (
             <div className="flex flex-col items-center justify-center absolute -top-[40px] sm:-top-[44px] md:-top-[45px] left-1/2 -translate-x-1/2 z-10">
            <div className="bg-[#FF5274] dark:bg-[#F66538] rounded-full 
            w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px] 
            flex items-center justify-center shadow-lg border-2 border-white dark:border-[#353839]">

                    <Image
                      src={item.lightIcon}
                      alt="Home Light"
                      width={30}
                      height={30}
                      className="block dark:hidden object-contain"
                    />
                    <Image
                      src={item.darkIcon}
                      alt="Home Dark"
                      width={30}
                      height={30}
                      className="hidden dark:block object-contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm md:text-base mt-1 text-gray-800 dark:text-white font-semibold">
                    {item.label}
                  </p>
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
                  <p className="text-[10px] sm:text-xs md:text-sm mt-1 text-gray-800 dark:text-white font-medium">
                    {item.label}
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
