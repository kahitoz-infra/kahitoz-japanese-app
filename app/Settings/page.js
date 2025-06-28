"use client";

import { useEffect, useState } from "react";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import Navbar from "../common_components/Navbar";

export default function Settings() {
  const [username, setUsername] = useState("Guest");
  const [darkMode, setDarkMode] = useState(false);
  const [cherryBlossom, setCherryBlossom] = useState(true);
  const [appVersion, setAppVersion] = useState("1.0.0");

  useEffect(() => {
    const loadPreferences = async () => {
      const { value: savedUsername } = await Preferences.get({ key: "username" });
      const { value: savedDarkMode } = await Preferences.get({ key: "darkMode" });
      const { value: savedBlossom } = await Preferences.get({ key: "cherryBlossom" });

      if (savedUsername) setUsername(savedUsername);
      if (savedDarkMode) setDarkMode(savedDarkMode === "true");
      if (savedBlossom !== null) setCherryBlossom(savedBlossom === "true");
    };

    loadPreferences();
  }, []);

  const updatePreference = async (key, value, setter) => {
    await Preferences.set({ key, value: value.toString() });
    setter(value);
  };

  const handleUsernameChange = async () => {
    const newUsername = prompt("Enter new username", username);
    if (newUsername) {
      await Preferences.set({ key: "username", value: newUsername });
      setUsername(newUsername);
    }
  };

  const openExternal = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-start p-4 bg-white dark:bg-black">
      {/* Blossom Background */}
      {cherryBlossom && (
        <div className="absolute w-full top-0 z-[-1] pointer-events-none">
          <CherryBlossomSnowfall isDarkMode={darkMode} />
        </div>
      )}

      {/* Header */}
      <h1 className="text-2xl font-bold mt-6 mb-4 text-center text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Settings List */}
      <div className="w-full max-w-md space-y-6">

        {/* Profile Section */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Profile</h2>
          <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">Username: {username}</p>
          <button
            onClick={handleUsernameChange}
            className="text-sm text-blue-500 underline"
          >
            Edit Username
          </button>
        </section>

        {/* Payment Section */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Payment</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">Free Plan</p>
          <button
            onClick={() => openExternal("https://yourapp.com/upgrade")}
            className="mt-2 px-4 py-2 bg-pink-400 dark:bg-pink-600 text-white rounded hover:opacity-90"
          >
            Upgrade Plan
          </button>
        </section>

        {/* Display Settings */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Display</h2>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => updatePreference("darkMode", !darkMode, setDarkMode)}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">Cherry Blossoms</span>
            <input
              type="checkbox"
              checked={cherryBlossom}
              onChange={() => updatePreference("cherryBlossom", !cherryBlossom, setCherryBlossom)}
            />
          </div>
        </section>

        {/* Help & Info */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Help & Info</h2>
          <button
            onClick={() => openExternal("/guide")}
            className="text-sm text-blue-500 underline"
          >
            App Guide
          </button>
          <button
            onClick={() => openExternal("/help")}
            className="text-sm text-blue-500 underline"
          >
            Help / FAQ
          </button>
          <button
            onClick={() => openExternal("/terms")}
            className="text-sm text-blue-500 underline"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => openExternal("/privacy")}
            className="text-sm text-blue-500 underline"
          >
            Privacy Policy
          </button>
        </section>

        {/* App Info */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">App Info</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">Version: {appVersion}</p>
        </section>
      </div>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 w-full">
        <Navbar />
      </div>
    </div>
  );
}
