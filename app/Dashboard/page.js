"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

// Custom image loader for optimization
const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
};

// Decode JWT token payload (simple base64 decoder)
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
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageError, setImageError] = useState({});

    const parseToken = useCallback(() => {
        const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth_token="));
        if (!cookie) {
            router.push("/");
            return null;
        }

        const token = cookie.split("=")[1];
        const data = parseJwt(token);
        if (!data || !data.name || !data.photo) {
            router.push("/");
            return null;
        }
        return { name: data.name, photo: data.photo };
    }, [router]);

    useEffect(() => {
        setIsLoading(true);
        const userData = parseToken();
        if (userData) {
            setUser(userData);
        }
        setIsLoading(false);
    }, [parseToken]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] dark:bg-[#292B2D]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 dark:border-[#F66538]"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const courseProgress = [
        { label: "View Kanji", percent: 69, link: "/ViewKanji" },
        { label: "View Vocabulary", percent: 33, link: "/ViewVocabulary" },
        { label: "Course C", percent: 86, link: "/" },
    ];

    const getStrokeColor = (percent) => {
        if (percent < 40) return "#FF4C4C";
        if (percent <= 70) return "#FFA500";
        return "#28A745";
    };

    const handleImageError = (index) => {
        setImageError((prev) => ({ ...prev, [index]: true }));
    };

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
                    {imageError.profile ? (
                        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-sm">No Image</span>
                        </div>
                    ) : (
                        <Image
                            loader={imageLoader}
                            src={user.photo}
                            alt={`${user.name} Profile Icon`}
                            width={96}
                            height={96}
                            className="object-cover w-24 h-24"
                            priority
                            onError={() => handleImageError("profile")}
                        />
                    )}
                </div>

                {/* Greeting */}
                <h1 className="text-2xl sm:text-2xl font-bold text-center mb-1">
                    Welcome back {user.name}!
                </h1>
                <p className="text-xl sm:text-sm text-center text-black dark:text-gray-200">
                    Be Better Everyday!
                </p>

                {/* Concentric Semi-Circles */}
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
                                {course.label} ={" "}
                                <span className="font-bold text-pink-600 dark:text-[#F66538]">
                  {course.percent}%
                </span>{" "}
                                Completed
                            </p>
                        ))}
                    </div>
                </div>

                {/* Consistent Days */}
                <p className="text-xl sm:text-2xl font-semibold text-center mt-4 mb-8">
                    Consistent for{" "}
                    <span className="text-pink-600 dark:text-[#F66538]">3 Days</span>
                </p>

                {/* Recent Courses Grid: 2 in first row, 1 centered below */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
                    {/* First two boxes */}
                    {courseProgress.slice(0, 2).map((course, idx) => {
                        const content = (
                            <div
                                className="relative rounded-xl overflow-hidden border
                  border-pink-600 dark:border-[#F66538]
                  bg-gray-200 dark:bg-[#3B3E40]
                  h-28"
                            >
                                {imageError[idx] ? (
                                    <div className="w-full h-28 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-sm">No Image</span>
                                    </div>
                                ) : (
                                    <Image
                                        loader={imageLoader}
                                        src={`/course-thumbnails/course${idx + 1}.jpg`}
                                        alt={course.label}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        loading="lazy"
                                        onError={() => handleImageError(idx)}
                                    />
                                )}
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-t-lg">
                                    <div
                                        className="h-2 rounded-t-lg transition-all duration-500 ease-in-out bg-black dark:bg-white"
                                        style={{ width: `${course.percent}%` }}
                                    />
                                </div>
                            </div>
                        );

                        return course.link ? (
                            <Link key={idx} href={course.link}>
                                {content}
                            </Link>
                        ) : (
                            <div key={idx}>{content}</div>
                        );
                    })}

                    {/* Third box centered below */}
                    {(() => {
                        const course = courseProgress[2];
                        const content = (
                            <div
                                className="relative rounded-xl overflow-hidden border
                  border-pink-600 dark:border-[#F66538]
                  bg-gray-200 dark:bg-[#3B3E40]
                  h-28 col-span-2 mx-auto w-1/2 sm:w-1/3"
                            >
                                {imageError[2] ? (
                                    <div className="w-full h-28 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-sm">No Image</span>
                                    </div>
                                ) : (
                                    <Image
                                        loader={imageLoader}
                                        src={`/course-thumbnails/course3.jpg`}
                                        alt={course.label}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        loading="lazy"
                                        onError={() => handleImageError(2)}
                                    />
                                )}
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-t-lg">
                                    <div
                                        className="h-2 rounded-t-lg transition-all duration-500 ease-in-out bg-black dark:bg-white"
                                        style={{ width: `${course.percent}%` }}
                                    />
                                </div>
                            </div>
                        );

                        return course.link ? (
                            <Link href={course.link}>{content}</Link>
                        ) : (
                            content
                        );
                    })()}
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