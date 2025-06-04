'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Login() {
  const [activeTab, setActiveTab] = useState('register');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-end bg-[#FAF9F6] font-inter">
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
      <div className="flex flex-col w-full h-[70vh] p-4 gap-y-4 bg-white border-t-[3px] border-[#FF5274] rounded-t-[30px] shadow-md fixed bottom-0 left-0">
        {/* Tabs */}
        <div className="flex justify-center items-center mb-10">
          <button
            onClick={() => setActiveTab('register')}
            className={`text-md font-semibold transition-colors relative ${
              activeTab === 'register' ? 'text-[#FF5274]' : 'text-black'
            }`}
          >
            Register
            {activeTab === 'register' && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF5274] rounded" />
            )}
          </button>

          {/* Vertical Separator */}
          <div className="w-px h-5 bg-gray-400 mx-6" />

          <button
            onClick={() => setActiveTab('login')}
            className={`text-md font-semibold transition-colors relative ${
              activeTab === 'login' ? 'text-[#FF5274]' : 'text-black'
            }`}
          >
            Login
            {activeTab === 'login' && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF5274] rounded" />
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
              {activeTab === 'register' && (
                <>
                  <Input placeholder="Username" icon="👤" />
                  <Input placeholder="Email Address" icon="📧" type="email" />
                  <Input placeholder="Create a Password" icon="🔒" type="password" />
                </>
              )}
              {activeTab === 'login' && (
                <>
                  <Input placeholder="Email Address" icon="📧" type="email" />
                  <Input placeholder="Password" icon="🔒" type="password" />
                </>
              )}

              <button className="w-2/3 h-12 bg-[#FF5274] text-white rounded-lg font-semibold mt-6 hover:opacity-90 transition-all">
                {activeTab === 'register' ? 'Create Account' : 'Sign In'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Input Component
function Input({ placeholder, icon, type = 'text' }) {
  return (
    <div className="w-11/12 mb-6 flex items-center bg-[#F0F0F0] rounded-md px-3 h-14 text-gray-600">
      <span className="mr-2 text-lg">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent flex-1 outline-none placeholder-gray-500 text-black"
      />
    </div>
  );
}
