'use client';

import Link from 'next/link';
import { Plus, Home } from 'lucide-react';

export default function CircularButton({
  href = "/",
  icon = "plus", // "plus" or "home"
}) {
  const IconComponent = icon === "home" ? Home : Plus;

  return (
    <div className="w-full flex justify-end pr-6 mt-6 mb-10">
      <Link href={href} passHref>
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FFB8C6] dark:bg-[#FF6E41] text-[#1a1a1a] shadow-md hover:scale-105 transition-transform"
          aria-label={icon === "home" ? "Home" : "Add"}
        >
          <IconComponent size={28} />
        </button>
      </Link>
    </div>
  );
}
