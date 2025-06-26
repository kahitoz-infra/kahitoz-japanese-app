'use client';

import Calendar from "./components/Calendar";
import RecapBlock from "./components/RecapBlock";
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
  const [photo, setPhoto] = useState("");

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
      setPhoto(data.photo);
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
        style={{
          position: "relative",
          zIndex: 1,
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
     {/* Top: Profile Picture + Greeting */}
<div className="flex items-center justify-between mb-6 mt-12 flex-wrap gap-4">
  {/* Profile Picture (left aligned) */}
  <div className="rounded-full overflow-hidden w-20 h-20 border border-black dark:border-white shrink-0">
    <img
      src={photo}
      alt="Profile"
      className="object-cover w-full h-full"
      width={80}
      height={80}
    />
  </div>

  {/* Greeting (right aligned) */}

  <div className="flex-1 min-w-[200px] text-right pr-2">
    <h2 className="text-xl font-bold text-left">Welcome back,</h2>
    <h2 className="text-xl font-bold text-left">{userName}!</h2>
    <p className="text-md font-semibold text-left">良い一日を</p>
  </div>
</div>

        {/* Motivational Quotes */}
        <div
          className="rounded-lg shadow-md mb-6 mx-auto text-center px-6 py-4"
          style={{
            backgroundColor: "var(--quote-bg)",
            maxWidth: "700px",
          }}
        >
          <MotivationalQuotes />
        </div>


        {/* Recap Block + Progress Bar */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[250px]">
            <RecapBlock kanji="日" meaning="Sun / Day" reading="にち / ひ" />
            <div
            className="flex-1 min-w-[250px] bg-white dark:bg-[#2f2f2f] rounded-lg shadow-md p-4"
          >
            <h3 className="text-lg font-semibold mb-2 border:border-black">Your Progress</h3>
            <ProgressBar />
          </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-20">
          <Calendar />
        </div>

        {/* Navbar */}
        <Navbar />
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
