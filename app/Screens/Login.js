"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import GoogleLogin from "@/app/common_components/GoogleLogin";
import Cookies from "js-cookie";

export default function Login({ onLogin = () => {} }) {
  const [activeTab, setActiveTab] = useState("register");
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      setLoading(false);
      onLogin(); // User already logged in
    } else {
      setLoading(false);
    }
  }, [onLogin]);

  const handleManualLogin = () => {
    Cookies.set("auth_token", "dummy_token", { expires: 1 }); // simulate login
    onLogin(); // notify parent to switch to app
  };

  return (
    <div>
      {!loading ? (
        <div className="h-screen flex flex-col justify-end bg-[#FAF9F6] dark:bg-[#333333] font-sans">
          {/* Main Container */}
          <div className="flex flex-col w-full h-[70vh] md:h-[60vh] p-4 md:p-8 gap-y-6 bg-white dark:bg-[#353839] border-t-[3px] border-[#FF5274] dark:border-[#FF9676] rounded-t-[30px] shadow-md fixed md:relative bottom-0 left-0 right-0">
            {/* Tabs */}
            <div className="flex justify-center items-center mb-6 md:mb-10 space-x-8">
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

            {/* Form */}
            <div className="h-full flex flex-col items-center justify-between">
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Fields */}
                  <div className="w-full flex flex-col gap-y-4 px-4 md:px-8">
                    {(activeTab === "register" || activeTab === "login") && (
                      <>
                        {activeTab === "register" && (
                          <Input
                            placeholder="Create a Username"
                            icon="/icons/user.svg"
                            type="text"
                          />
                        )}
                        <Input
                          placeholder="Enter your Email"
                          icon="/icons/email.svg"
                          type="email"
                        />
                        <Input
                          placeholder={
                            activeTab === "register"
                              ? "Create a Password"
                              : "Enter Password"
                          }
                          icon="/icons/password.svg"
                          type="password"
                        />
                      </>
                    )}
                  </div>

                  {/* Main Action Button */}
                  <button
                    onClick={handleManualLogin}
                    className="w-11/12 md:w-4/5 h-12 bg-[#FF5274] dark:bg-[#F66538] text-white rounded-lg font-semibold mt-8 hover:opacity-90 transition-all flex items-center justify-center text-sm md:text-base"
                  >
                    {activeTab === "register" ? "Create Account" : "Sign In"}
                  </button>

                  {/* Google Login */}
                  <div className="mt-8">
                    <GoogleLogin />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-screen h-screen items-center justify-center bg-[#faf9f6] dark:bg-[#333333]">
          <Image
            src="/icons/loading.svg"
            alt="loading"
            width={30}
            height={30}
            className="animate-spin"
          />
        </div>
      )}
    </div>
  );
}

// 🧩 Input Component
function Input({ placeholder, icon, type = "text" }) {
  return (
    <div className="w-full px-4">
      <div className="flex items-center border rounded-md px-3 py-2 w-full h-14 bg-[#f2f2f2]">
        <Image
          src={icon}
          alt={`${placeholder} icon`}
          width={20}
          height={20}
          className="opacity-70 mr-2"
        />
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
        />
      </div>
    </div>
  );
}