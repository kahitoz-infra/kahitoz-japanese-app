'use client';

import { Plus } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export default function CircularButton({ href }) {
  return (
    <div className="w-full flex justify-end pr-6 mt-6 mb-10">
      <Link href={href} passHref>
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FFB8C6] dark:bg-[#FF6E41] text-black text-3xl shadow-md hover:scale-105 transition-transform"
          aria-label="Add"
        >
          <Plus size={28} />
        </button>
      </Link>
    </div>
  );
}
