"use client";

import JLPTLevelSelector from "../common_components/JLPTSelect";
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
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [quizType, setQuizType] = useState(null);
  const router = useRouter();

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

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
  };

  const handleQuizTypeChange = (type) => {
    setQuizType(type);
  };

  return (
    <div className="flex flex-col text-black dark:text-white min-h-screen">
      {/* JLPT Level Selector */}
      <div className="mt-1">
        <JLPTLevelSelector 
          userType={subsType}
          selectedLevel={selectedLevel}
          onLevelChange={handleLevelChange}
          selectedQuizType={quizType}
          onQuizTypeChange={handleQuizTypeChange}
        />

        {/* The page is scrollable in case of more options on the screen*/}
        <div className="flex-1 overflow-auto min-h-0 px-4 pb-32 mt-10"></div>

      </div>
    </div>
  );
}
