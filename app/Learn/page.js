"use client";
import { useState } from "react";
import { Eye, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

const Learn = () => {
  const [openBox, setOpenBox] = useState(null);

  const handleBoxClick = (index) => {
    setOpenBox(openBox === index ? null : index);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-screen pb-28 pt-8 items-center bg-[#f3f3f3] dark:bg-[#292B2D] text-black dark:text-white relative px-4">
        {/* Profile Icon */}
        <div className="mt-2 w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden mb-6 border border-black dark:border-white">
          <Image
            src="/profile-icon.jpg"
            alt="Profile Icon"
            width={96}
            height={96}
            className="object-cover"
            priority
          />
        </div>

        {/* Page Heading */}
        <h1 className="text-xl font-semibold mb-4">Learn Page</h1>

        {/* Grid container */}
        <div className="grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-10 mt-4 relative">
          {/* Grid Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-400 dark:bg-gray-600 transform -translate-y-1/2 pointer-events-none" />

          {/* 4 Boxes */}
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
                openBox === index && (index === 0 || index === 1) ? "mb-20" : "mb-0"
              }`}
            >
              {/* Box */}
              <div
                onClick={() => handleBoxClick(index)}
                className="w-36 h-36 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-md flex items-center justify-center text-lg font-medium cursor-pointer"
              >
                Box {index + 1}
              </div>

              {/* Circular Icon Buttons */}
              {openBox === index && (
                <div className="absolute top-full mt-4 flex gap-4 transition-opacity duration-1000">
                  <Link href={`/view/${index}`}>
                    <div className="w-14 h-14 rounded-full bg-[#FF5274] dark:bg-[#F66538] shadow-md flex items-center justify-center cursor-pointer">
                      <Eye color="white" size={20} />
                    </div>
                  </Link>
                  <Link href={`/learn/${index}`}>
                    <div className="w-14 h-14 rounded-full bg-[#FF5274] dark:bg-[#F66538] shadow-md flex items-center justify-center cursor-pointer">
                      <Book color="white" size={20} />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Navbar />
      </div>
    </>
  );
};

export default Learn;
