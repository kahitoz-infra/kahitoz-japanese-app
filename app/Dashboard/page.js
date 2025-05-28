"use client";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";

const Dashboard = () => {
  const username = "John";
  const quote = "Be better.";

  return (
    <>
      <div className="flex flex-col min-h-screen pb-20 px-4 pt-16 bg-white relative">

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
            <h1 className="text-2xl font-bold text-gray-900">Hi {username} 👋</h1>
            <p className="text-sm text-gray-600 mt-1">{quote}</p>
          </div>
        </div>

        {/* LET'S GET STARTED Heading */}
        <div className="mt-8 px-2 text-center">
          <h2 className="text-xl font-semibold text-gray-800 uppercase">Let's Get Started</h2>
          <div className="flex justify-center mt-1">
            <div className="h-1 w-20 bg-[#F789A3] rounded-full"></div>
          </div>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 px-2 place-items-center">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="w-[170px] h-[190px] flex items-center justify-center bg-white border-[2.83px] border-[#F789A3] rounded-xl shadow-sm text-gray-700 font-medium text-sm"
            >
              Box {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Navbar />
      </div>
    </>
  );
};

export default Dashboard;
