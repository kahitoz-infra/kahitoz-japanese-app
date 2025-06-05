"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Login() {
  const [activeTab, setActiveTab] = useState("register");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-end bg-[#FAF9F6] dark:bg-[#333333] font-sans">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex justify-center mb-6"
      >
        <Image
          src="/zen_kanji.png"
          alt="App Logo"
          width={180}
          height={90}
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Main Container */}
      <div className="flex flex-col w-full h-[70vh] p-4 gap-y-4 bg-white dark:bg-[#353839] border-t-[3px] border-[#FF5274] dark:border-[#FF9676] rounded-t-[30px] shadow-md fixed bottom-0 left-0">
        {/* Tabs */}
        <div className="flex justify-center items-center mb-10">
          <button
            onClick={() => setActiveTab("register")}
            className={`text-md font-semibold transition-colors relative ${
              activeTab === "register"
                ? "text-[#FF5274] dark:text-[#FF9676]"
                : "text-black dark:text-[#FF9676]"
            }`}
          >
            Register
            {activeTab === "register" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF5274] dark:bg-[#FF9676] rounded" />
            )}
          </button>

          {/* Vertical Separator */}
          <div className="w-px h-5 bg-gray-400 mx-16" />

          <button
            onClick={() => setActiveTab("login")}
            className={`text-md font-semibold transition-colors relative ${
              activeTab === "login"
                ? "text-[#FF5274] dark:text-[#FF9676]"
                : "text-black dark:text-[#FF9676]"
            }`}
          >
            Login
            {activeTab === "login" && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF5274] dark:bg-[#FF9676] rounded" />
            )}
          </button>
        </div>

        {/* Form Fields */}
        <div className="h-full flex flex-col items-center justify-between">
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              {activeTab === "register" && (
                <>
                <div className="w-full px-4 mb-2">
                    <div className="flex items-center border rounded-md px-3 py-2 w-full h-14 bg-[#f2f2f2] ">
                      {/* Username Input field */}
                      <Image
                        src="/icons/user.svg" // Place your icon in /public/icons/
                        alt="User Icon"
                        width={20}
                        height={20}
                        className="opacity-70 mr-2"
                      />
                      {/* Username Input */}
                      <input
                        type="username"
                        placeholder="Create a Username"
                        className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                  {/* Email Input Field */}
                  <div className="w-full px-4 py-2">
                    <div className="flex items-center border rounded-md px-3 py-2 w-full h-14 bg-[#f2f2f2] ">
                      <Image
                        src="/icons/email.svg" // Place your icon in /public/icons/
                        alt="Email Icon"
                        width={20}
                        height={20}
                        className="opacity-70 mr-2"
                      />
                      {/* Email Input */}
                      <input
                        type="email"
                        placeholder="Enter your Email"
                        className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>


                  <div className="w-full px-4 py-2">
                    <div className="flex items-center border rounded-md px-3 py-2 w-full h-14 bg-[#f2f2f2] ">
                      {/* Password Input Field */}
                      <Image
                        src="/icons/password.svg" // Place your icon in /public/icons/
                        alt="Password Icon"
                        width={20}
                        height={20}
                        className="opacity-70 mr-2"
                      />
                      {/* Password Input */}
                      <input
                        type="string"
                        placeholder="Create a Password"
                        className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                </>
              )}
              {activeTab === "login" && (
                <>
                 {/* Email Input Field */}
                  <div className="w-full px-4 py-2">
                    <div className="flex items-center border rounded-md px-3 py-2 w-full h-14 bg-[#f2f2f2] ">
                      <Image
                        src="/icons/email.svg" // Place your icon in /public/icons/
                        alt="Email Icon"
                        width={20}
                        height={20}
                        className="opacity-70 mr-2"
                      />
                      {/* Email Input */}
                      <input
                        type="email"
                        placeholder="Enter your Email"
                        className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full px-4 py-2">
                    <div className="flex items-center border rounded-md px-3 py-2 w-full h-14 bg-[#f2f2f2] ">
                      {/* Password Input Field */}
                      <Image
                        src="/icons/password.svg" // Place your icon in /public/icons/
                        alt="Password Icon"
                        width={20}
                        height={20}
                        className="opacity-70 mr-2"
                      />
                      {/* Password Input */}
                      <input
                        type="password"
                        placeholder="Create a Password"
                        className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                </>
              )}

              {/* Main Button */}
              <button className="w-2/3 h-12 bg-[#FF5274] dark:bg-[#F66538] text-white rounded-lg font-semibold mt-2 hover:opacity-90 transition-all">
                {activeTab === "register" ? "Create Account" : "Sign In"}
              </button>

              {/* Sign in with Google */}
              <button className="w-[173px] h-[40px] mt-8 bg-[#f2f2f2]: dark bg-[#f2f2f2] rounded-full text-black font-medium flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-all">
                <Image
                  src="/google-logo.webp"
                  alt="Google Icon"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-sm">Sign in with Google</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Input Component
function Input({ placeholder, icon, type = "text" }) {
  return (
    <div className="w-11/12 mb-6 flex items-center bg-[#F0F0F0] dark:bg-[#f1f1f1] rounded-md px-3 h-14 text-gray-600 dark:text-black">
      <span className="mr-2 text-lg">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent flex-1 outline-none placeholder-gray-500 text-black dark:text-black"
      />
    </div>
  );
}
