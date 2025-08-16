'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  User,
  Crown,
  CreditCard,
  KeyRound,
  BookOpen,
  Flower,
  Moon,
  Music,
  ShieldCheck,
  LogOut,
  ArrowLeft
} from 'lucide-react';

export default function SettingsPage() {
  const [cherryBlossom, setCherryBlossom] = useState(false);
  const [themeDark, setThemeDark] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");

    // Clear localStorage if needed
    localStorage.removeItem("darkMode");
    localStorage.removeItem("cherryBlossom");

    router.refresh(); // Triggers Login.js logic to show login screen
  };

  const staticLinks = [
    { label: 'Profile', href: '/profile', icon: <User size={20} /> },
    { label: 'Subscription Settings', href: '/subscription-settings', icon: <Crown size={20} /> },
    { label: 'Payment Settings', href: '/payment-settings', icon: <CreditCard size={20} /> },
    { label: 'Change Password', href: '/change-password', icon: <KeyRound size={20} /> },
    { label: 'App Guide', href: '/app-guide', icon: <BookOpen size={20} /> },
    { label: 'Privacy Policy', href: '/privacy-policy', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen px-6 py-6 font-bold bg-white dark:bg-[#333333] text-black flex flex-col justify-between font-sans">
      {/* Back Button */}
      <div>
        <Link href="/" className="text-sm flex items-center font-medium text-black dark:text-white mb-6">
          <ArrowLeft className="mr-2" size={18} /> Back
        </Link>

        <h1 className="text-xl font-bold mb-6 text-center dark:text-white w-fit mx-auto border-b-2 border-pink-400 dark:border-[#FF5E2C]">
          SETTINGS
        </h1>

        {/* Static Links */}
        <ul className="space-y-4">
          {staticLinks.map(({ label, href, icon }) => (
            <li key={label}>
              <Link href={href} className="flex items-center text-md dark:text-white font-bold transition">
                <span className="text-lg mr-4">{icon}</span>
                {label}
              </Link>
            </li>
          ))}


          {/* Logout */}
          <li className="flex items-center text-md font-bold text-[#ff4970] mt-4 dark:text-[#FF5E2C]">
            <button onClick={handleLogout} className="flex items-center hover:opacity-80 transition">
              <LogOut size={20} className="mr-4" />
              Log Out
            </button>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-200 mt-8">
        <p>
          <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          <span className="mx-1">|</span>
          <Link href="/support" className="hover:underline">Help & Support</Link>
        </p>
        <p className="mt-1">App Version 0.0000</p>
      </div>
    </div>
  );
}

