'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Login() {
    const { theme } = useTheme();
    const [showFields, setShowFields] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fieldsTimer = setTimeout(() => setShowFields(true), 1300); // 1s after logo fade-in (which has 300ms delay)
        return () => clearTimeout(fieldsTimer);
    }, []);

    const logoSrc = theme === 'dark' ? '/Zen Kanji Dark.png' : '/Zen Kanji.png';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6] dark:bg-[#2F2F2F] px-4 font-inter transition-colors">
            <div className="flex flex-col items-center">
                <motion.img
                    src={logoSrc}
                    alt="App Logo"
                    className="mx-auto object-contain"
                    style={{ width: 360, height: 211 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                />

                {showFields && (
                    <motion.div
                        className="flex flex-col items-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-[228px] h-[35px] px-3 mb-3 rounded-[10px] border border-[#F4A7B9] bg-white text-black placeholder-gray-400 dark:bg-white dark:text-black transition-all outline-none focus:opacity-80 focus:ring-2 focus:ring-[#F4A7B9]"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-[228px] h-[35px] px-3 mb-3 rounded-[10px] border border-[#F4A7B9] bg-white text-black placeholder-gray-400 dark:bg-white dark:text-black transition-all outline-none focus:opacity-80 focus:ring-2 focus:ring-[#F4A7B9]"
                        />

                        <button
                            className="w-[53.41px] h-[53.41px] rounded-full bg-[#F789A3] flex items-center justify-center mb-6"
                            aria-label="Login"
                            type="submit"
                        >
                            <ArrowRight size={25.98} className="text-white" />
                        </button>

                        <button
                            className="w-[150px] h-[30px] text-sm rounded-[10px] border border-[#F4A7B9] bg-white text-black hover:opacity-80 transition-all mb-10"
                        >
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
