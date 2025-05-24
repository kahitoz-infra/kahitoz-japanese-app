'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
    const [showFields, setShowFields] = useState(false);

    useEffect(() => {
        const fieldsTimer = setTimeout(() => setShowFields(true), 1300);
        return () => clearTimeout(fieldsTimer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6] dark:bg-[#2F2F2F] px-4 font-inter transition-colors">
            <div className="flex flex-col items-center">

                {/* Logo - Light Theme */}
                <motion.div
                    className="block dark:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <Image
                        src="/zen_kanji.png"
                        alt="App Logo Light"
                        width={360}
                        height={211}
                        className="mx-auto object-contain"
                        priority
                    />
                </motion.div>

                {/* Logo - Dark Theme */}
                <motion.div
                    className="hidden dark:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <Image
                        src="/zen_kanji_dark.png"
                        alt="App Logo Dark"
                        width={360}
                        height={211}
                        className="mx-auto object-contain"
                        priority
                    />
                </motion.div>

                {showFields && (
                    <motion.div
                        className="flex flex-col items-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="w-[228px] h-[35px] px-3 mb-3 rounded-[10px] border border-[#F4A7B9] bg-white text-black placeholder-gray-400 dark:bg-white dark:text-black transition-all outline-none focus:opacity-80 focus:ring-2 focus:ring-[#F4A7B9]"
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-[228px] h-[35px] px-3 mb-3 rounded-[10px] border border-[#F4A7B9] bg-white text-black placeholder-gray-400 dark:bg-white dark:text-black transition-all outline-none focus:opacity-80 focus:ring-2 focus:ring-[#F4A7B9]"
                        />

                        <Link href="/Dashboard">
                            <button
                                className="w-[53.41px] h-[53.41px] rounded-full bg-[#F789A3] flex items-center justify-center mb-6"
                                aria-label="Login"
                                type="submit"
                            >
                                <ArrowRight size={25.98} className="text-white" />
                            </button>
                        </Link>

                        <button className="w-[150px] h-[30px] text-sm rounded-[10px] border border-[#F4A7B9] bg-white text-black hover:opacity-80 transition-all mb-10">
                            Register Account
                        </button>

                        <div className="flex items-center justify-center space-x-4">
                            <div className="w-[38px] h-[38px] bg-white dark:bg-white rounded-full flex items-center justify-center">
                                <img src="/google-logo.webp" alt="Google" className="w-7 h-7" />
                            </div>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-500"></div>
                            <div className="w-[38px] h-[38px] bg-white dark:bg-white rounded-full flex items-center justify-center">
                                <img src="/facebook-logo.png" alt="Facebook" className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
