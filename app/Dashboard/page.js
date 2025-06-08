"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
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

const Dashboard = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [photo, setPhoto] = useState("");


    useEffect(() => {
        const setUserDetails = (token) => {
            if (!token) {
                router.push("/");
                return;
            }

            try {
                const data = parseJwt(token);
                setUserName(data.name);
                setPhoto(data.photo);
            } catch (error) {
                router.push("/");
            } finally {
                setIsLoading(false);
            }
        };

        const authToken = Cookies.get("auth_token");
        setUserDetails(authToken);
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] dark:bg-[#292B2D]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-[#F66538]"></div>
            </div>
        );
    }


    const courseProgress = [
        { label: "View Kanji", percent: 69, link: "/ViewKanji", src: "/banner/View_Kanji.png" },
        { label: "View Vocabulary", percent: 33, link: "/ViewVocabulary", src: "/banner/View_Vocabulary.png"},
        { label: "View Grammar", percent: 86, link: "/Dashboard",  src: "/banner/View_Grammar.png"},
    ];

  // Updated color scale from dark red to dark green
  const getStrokeColor = (percent) => {
    if (percent < 20) return "#8B0000";        // Dark Red
    if (percent < 40) return "#FF4C4C";         // Light Red
    if (percent < 60) return "#FFA500";         // Dark Yellow
    if (percent < 80) return "#90EE90";         // Light Green
    return "#006400";                           // Dark Green
  };

  const truncateLabel = (label, max = 15) =>
    label.length > max ? label.slice(0, max) + "..." : label;

  const hasCourses = courseProgress.length > 0;

    return (
        <>
            <div
                className="flex flex-col min-h-screen w-screen pb-28 pt-8 items-center
          bg-[#f3f3f3] dark:bg-[#292B2D]
          text-black dark:text-white
          relative px-4"
            >
                {/* Profile Icon */}
                <div className="mt-2 w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden mb-6 border border-black dark:border-white">

                    <img
                        src={photo}
                        alt="Profile"
                        className="object-cover w-24 h-24"
                        width={96}
                        height={96}
                    />
                </div>

                {/* Greeting */}
                <h1 className="text-2xl sm:text-2xl font-bold text-center mb-1">
                    Welcome back {userName}!
                </h1>
                <p className="text-xl sm:text-sm text-center text-black dark:text-gray-200">
                    Be Better Everyday!
                </p>

        {/* Concentric Semi-Circles */}
        {hasCourses && (
          <div className="relative w-full max-w-[440px] h-[250px] mb-2">
            <svg width="100%" height="100%" viewBox="0 0 500 250" className="mx-auto">
              {courseProgress.map((course, i) => {
                const radius = 210 - i * 30;
                const cx = 250;
                const cy = 250;
                const circumference = Math.PI * radius;
                const offset = circumference * (1 - course.percent / 100);

                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={getStrokeColor(course.percent)}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-180 ${cx} ${cy})`}
                  />
                );
              })}
            </svg>

            {/* Centered Progress Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] text-center mt-12 px-2">
              <p className="text-base sm:text-lg font-bold mb-2">Your Progress</p>
              {courseProgress.map((course, idx) => (
                <p key={idx} className="text-xs sm:text-sm">
                  {truncateLabel(course.label)} ={" "}
                  <span className="font-bold text-pink-600 dark:text-[#F66538]">
                    {course.percent}%
                  </span>{" "}
                  Completed
                </p>
              ))}
            </div>
          </div>
        )}

                {/* Consistent Days */}
                <p className="text-xl sm:text-2xl font-semibold text-center mt-4 mb-8">
                    Consistent for{" "}
                    <span className="text-pink-600 dark:text-[#F66538]">3 Days</span>
                </p>

                <div className="max-w-3xl mx-auto grid grid-cols-2 gap-6">
                    {courseProgress.map(({ label, percent, link, src }, index) => {
                        const isLastOddSingle = courseProgress.length % 2 === 1 && index === courseProgress.length - 1;

                        return (
                            <Link
                                key={label}
                                href={link}
                                className={`relative rounded-lg overflow-hidden shadow-lg
              ${isLastOddSingle ? "col-span-2 max-w-xl mx-auto" : ""}
              block h-48`}
                                aria-label={label}
                            >
                                {/* Full image covering the card */}
                                <Image
                                    src={src}
                                    alt={label}
                                    width={200}
                                    height={100}
                                    // layout="fill"
                                    // objectFit="cover"
                                    // priority={true}
                                />

                                {/* Overlay label (optional) */}
                                <div className="absolute top-3 left-3 text-white font-semibold text-lg drop-shadow-lg">
                                    {label}
                                </div>

                                {/* Thin progress bar fixed at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
                                    <div
                                        className="h-1 bg-green-500"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>

            {/* Bottom Navbar */}
            <div className="fixed bottom-0 left-0 right-0 z-30">
                <Navbar />
            </div>
        </>
    );
};

export default Dashboard;