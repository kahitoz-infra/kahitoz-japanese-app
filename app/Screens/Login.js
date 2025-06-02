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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] font-inter px-4">
      <div className="relative w-full max-w-sm">

        {/* Main Container with rounded top and border-top */}
        <div className="absolute top-0 w-full h-[60%] bg-white border-t-[3px] border-[#FF5274] rounded-t-[30px] shadow-md" />

        <div className="relative z-10 pt-10 pb-6 px-6">

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

          {/* Tabs */}
          <div className="flex justify-center space-x-6 mb-6">
            {['register', 'login'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-md font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-[#FF5274]' : 'text-black'
                }`}
              >
                {tab === 'register' ? 'Register' : 'Login'}
                {activeTab === tab && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF5274] rounded" />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
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

              <button className="w-full h-10 bg-[#FF5274] text-white rounded-lg font-semibold mt-4 hover:opacity-90 transition-all">
                {activeTab === 'register' ? 'Create Account' : 'Sign In'}
              </button>

              {/* Google Sign In */}
              <button className="w-full h-10 mt-3 bg-gray-100 text-black rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-all">
                <Image src="/google-logo.webp" alt="Google" width={20} height={20} />
                <span className="text-sm">Sign in with Google</span>
              </button>

              {/* Register Info */}
              {activeTab === 'register' && (
                <div className="bg-[#FFEFF2] mt-5 text-sm text-black text-center px-3 py-2 rounded-md">
                  A verification code is sent to XXXXX@gmail.com
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper input component
function Input({ placeholder, icon, type = 'text' }) {
  return (
    <div className="w-full mb-3 flex items-center bg-[#F0F0F0] rounded-md px-3 h-10 text-gray-600">
      <span className="mr-2 text-lg">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent flex-1 outline-none placeholder-gray-500 text-black"
      />
    </div>
  );
}
