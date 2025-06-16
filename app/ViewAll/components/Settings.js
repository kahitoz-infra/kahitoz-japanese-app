"use client";
import Image from "next/image";

export default function Settings({ onClick }) {
  return (
    <div
      className="flex gap-x-2 items-center mb-2 cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={"/icons/settings.svg"}
        width={24}
        height={24}
        alt="settings"
      />
      <p>Settings</p>
    </div>
  );
}
