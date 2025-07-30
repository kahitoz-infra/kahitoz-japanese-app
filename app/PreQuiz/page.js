"use client";

import JLPTLevelSelector from "../common_components/JLPTSelect";
import Navbar from "../common_components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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

export default function JLPTQuizSetupPage() {
  const [subsType, setSubsType] = useState("");
  const router = useRouter()

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
      setSubsType(data.user_sub);
    };

    initializeUser();
  }, [router]);
  return (
    <div className="flex flex-col text-black dark:text-white min-h-screen">
      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        {/* Quiz Setup Title */}
        <h1 className="text-2xl font-bold text-black dark:text-white text-center mt-4">
          Zen Kanji Quiz Section
        </h1>
      </div>

      {/* JLPT Level Selector */}
      <div className="mt-1">
        <JLPTLevelSelector userType={subsType}/>

        {/* The page is scrollable in case of more options on the screen*/}
        <div className="flex-1 overflow-auto min-h-0 px-4 pb-32 mt-10"></div>

        {/* Bottom Navbar */}
        <Navbar />
      </div>
    </div>
  );
}
