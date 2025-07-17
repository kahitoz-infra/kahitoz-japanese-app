"use client";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsButton({ onClick }) {
  return (
    <div
      className="flex gap-x-2 items-center mb-3 cursor-pointer font-bold text-black dark:text-white"
      onClick={onClick}
    >
      <SettingsIcon size={24} />
      <p>SETTINGS</p>
    </div>
  );
}