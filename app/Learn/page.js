"use client";
import { useState, useEffect, useRef } from "react";
import { EyeIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

// Cherry blossom particle canvas
const CherryBlossomSnowfall = () => {
  const canvasRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const dark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(dark);
    };

    checkDarkMode();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particleCount = 100;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        speedY: 0.2 + Math.random() * 0.4,
        swayAngle: Math.random() * 2 * Math.PI,
        swaySpeed: 0.005 + Math.random() * 0.01,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const color = isDark
        ? "rgba(255, 102, 0, 0.8)"
        : "rgba(222, 49, 99, 0.8)";

      particles.forEach((p) => {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * 0.3;
        p.y += p.speedY;

        if (p.x > width) p.x = 0;
        else if (p.x < 0) p.x = width;

        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 w-full h-full z-0"
      style={{ userSelect: "none" }}
    />
  );
};

const Learn = () => {
  const [openBox, setOpenBox] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const quotes = [
    "Keep going, you're doing great!",
    "Every step counts!",
    "Believe in yourself.",
    "Stay positive, work hard.",
  ];

  const handleBoxClick = (index) => {
    setOpenBox(openBox === index ? null : index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen w-screen pb-28 pt-8 items-center bg-[#f3f3f3] dark:bg-[#292B2D] text-black dark:text-white relative px-4">
        <CherryBlossomSnowfall />

        {/* Heading */}
        <h1 className="text-2xl font-semibold mt-4 mb-2 z-10 relative">Learn Page</h1>

        {/* Quote */}
        <div
          className="mb-6 text-center text-gray-700 dark:text-gray-300 text-lg font-semibold transition-opacity duration-500 z-10 relative"
          style={{
            opacity: visible ? 1 : 0,
            transitionTimingFunction: "ease-in-out",
          }}
        >
          {quotes[quoteIndex]}
        </div>

        {/* Grid with 4 boxes */}
        <div className="grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-10 mt-4 relative z-10">
          {/* X and Y axis lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-400 dark:bg-gray-600 transform -translate-x-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-400 dark:bg-gray-600 transform -translate-y-1/2 pointer-events-none" />

          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`relative flex flex-col items-center transition-all duration-300 ${
                openBox === index && (index === 0 || index === 1)
                  ? "mb-20"
                  : "mb-0"
              }`}
            >
              <div
                onClick={() => handleBoxClick(index)}
                className="w-36 h-64 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-md flex items-center justify-center text-lg font-medium cursor-pointer"
              >
                Box {index + 1}
              </div>

              {openBox === index && (
                <div className="absolute top-full mt-4 flex gap-4 transition-opacity duration-1000">
                  <Link href={index === 0 ? "/KanjiCards" : `/view/${index}`}>
                    <div className="w-14 h-14 rounded-full bg-[#FF5274] dark:bg-[#F66538] shadow-md flex items-center justify-center cursor-pointer">
                      <EyeIcon className="w-6 h-6 text-white" />
                    </div>
                  </Link>
                  <Link href={`/learn/${index}`}>
                    <div className="w-14 h-14 rounded-full bg-[#FF5274] dark:bg-[#F66538] shadow-md flex items-center justify-center cursor-pointer">
                      <BookOpenIcon className="w-6 h-6 text-white" />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Navbar at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Navbar />
      </div>
    </>
  );
};

export default Learn;
