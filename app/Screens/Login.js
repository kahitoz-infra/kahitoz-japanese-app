"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleLogin from "@/app/components/GoogleLogin";
import Cookies from "js-cookie";

export default function Login() {
  const [activeTab, setActiveTab] = useState("register");
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);

  }, []);

    useEffect(() => {
        const setUserDetails = (token) => {
            if (!token) {
                setLoading(false)
            }
            else{
                setLoading(false)
                router.push("/Dashboardv2");
            }

        };

        const authToken = Cookies.get("auth_token");
        setUserDetails(authToken);
    }, []);

  return (
      <div>

      {!loading ? ( <div className="h-screen flex flex-col justify-end bg-[#FAF9F6] dark:bg-[#333333] font-sans">


          {/* Main Container */}
          <div className="flex flex-col w-full h-[70vh] md:h-[60vh] p-4 md:p-8 gap-y-6 bg-white dark:bg-[#353839] border-t-[3px] border-[#FF5274] dark:border-[#FF9676] rounded-t-[30px] shadow-md fixed md:relative bottom-0 left-0 right-0">
              {/* Tabs */}
              <div className="flex justify-center items-center mb-6 md:mb-10 space-x-8">
                  <button
                      onClick={() => setActiveTab("register")}
                      className={`text-md font-semibold transition-colors relative ${activeTab === "register"
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
                      className={`text-md font-semibold transition-colors relative ${activeTab === "login"
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
                              <div className="w-full flex flex-col gap-y-4 px-4 md:px-8">
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

                          <Link
                              href="/Dashboardv2"
                              className="w-11/12 md:w-4/5 h-12 bg-[#FF5274] dark:bg-[#F66538] text-white rounded-lg font-semibold mt-8 hover:opacity-90 transition-all flex items-center justify-center text-sm md:text-base"
                          >
                              {activeTab === "register" ? "Create Account" : "Sign In"}
                          </Link>
                          <div className={'mt-8'}>
                              <GoogleLogin/>
                          </div>
                      </motion.div>
                  )}
              </div>
          </div>
      </div>):( <div className="flex w-screen h-screen items-center justify-center bg-[#faf9f6] dark:bg-[#333333]">
          <Image
              src="/icons/loading.svg"
              alt="loading"
              width={30}
              height={30}
              className="animate-spin"
          />
      </div>) }


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
