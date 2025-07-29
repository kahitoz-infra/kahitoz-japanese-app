'use client';

import Calendar from "../common_components/Calendar";
import RecapBlock from "../common_components/RecapBlock";
import Navbar from "../common_components/Navbar";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import MotivationalQuotes from "../common_components/MotivationalQuotes";
import ProgressBar from "../common_components/ProgressBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { refresh_auth_token } from "../middleware";

const parseJwt = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [subsType, setSubsType] = useState("")

  useEffect(() => {
    const initializeUser = async () => {
      let authToken = Cookies.get("auth_token");

      if (!authToken) {
        const newAuthToken = await refresh_auth_token();
        if (!newAuthToken) {
          router.push("/");
          return;
        }
        authToken = newAuthToken;
      }

      const data = parseJwt(authToken);
      if (!data || !data.name || !data.photo) {
        router.push("/");
        return;
      }

      setUserName(data.name);
      setSubsType(data.user_sub)
      setIsLoading(false);
    };

    initializeUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] dark:bg-[#292B2D]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-[#F66538]"></div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* 🌸 Background Snowfall */}
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}>
        <CherryBlossomSnowfall />
      </div>

      {/* Main Content */}
      <main
      className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1400px] mx-auto"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
    <div className="flex flex-row items-center text-left mb-6 mt-12 gap-6">
      {/* Image Section */}
      <div className="relative w-20 h-20">

      {/* Badge — Only show if subsType is "plus" */}
      {subsType === "plus" && (
        <div className="absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full z-10 bg-black text-white dark:bg-white dark:text-black shadow-md">
          PLUS
        </div>
      )}
      {/* Light mode image */}
      <div className={`rounded-full dark:hidden overflow-hidden w-20 h-20 border-b-4 ${
        subsType === "plus" ? "border-[#FF5274]" : "border-pink-400"
      }`}>
        <img src="/Chibi_dp.png" alt="Profile" className="object-cover w-full h-full" />
      </div>

      {/* Dark mode image */}
      <div className={`rounded-full hidden dark:flex overflow-hidden w-20 h-20 border-b-4 absolute top-0 left-0 ${
        subsType === "plus" ? "border-[#F66538]" : "border-orange-500"
      }`}>
        <img src="/Chibi_dp_dark.png" alt="Profile" className="object-cover w-full h-full" />
      </div>
      </div>

      {/* Text Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Welcome back,</h2>
        <h2 className="text-xl font-semibold">
          {userName}!
        </h2>
        <p className="text-md font-semibold">良い一日を</p>
      </div>
    </div>



        {/* Motivational Quotes */}
        <div className="flex justify-center mb-6">
        <div
          className="rounded-lg shadow-md text-center px-4 py-4 w-full max-w-[700px]"
          style={{ backgroundColor: "var(--quote-bg)" }}
        >
          <MotivationalQuotes />
        </div>
      </div>


        <div className="flex justify-center mb-6">
  <div className="w-full max-w-[700px] flex flex-col gap-6 items-center">
    {/* Recap Block */}
    <div className="w-full">
      <RecapBlock kanji="日" meaning="Sun / Day" reading="にち / ひ" />
    </div>

    {/* Progress Bar */}
    <div className="w-full bg-white dark:bg-[#2f2f2f] rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
      <ProgressBar />
    </div>
  </div>
</div>


<div className="mb-24 w-full px-4 sm:px-6 md:px-10">
  <Calendar />
</div>
      </main>

      {/* 🌗 Light/Dark styles for quote box */}
      <style jsx global>{`
        :root {
          --quote-bg: #FFF0C9;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --quote-bg: #AAD0C7;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
