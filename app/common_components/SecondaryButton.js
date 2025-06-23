'use client';
import Link from 'next/link';

export default function SecondaryButton({ text, href = '', disabled = false }) {
  const safeHref = disabled || !href ? '#' : href;

  return (
    <Link href={safeHref} onClick={(e) => disabled && e.preventDefault()}>
      <button
        disabled={disabled}
        className={`
          px-6 py-3 rounded-xl font-bold transition-all duration-200
          border-2
          ${
            disabled
              ? 'border-gray-400 text-gray-400 cursor-not-allowed'
              : 'border-[#FF3A60] text-[#FF3A60] dark:border-[#FF5E2C] bg-white dark:bg-[#333333] dark:text-[#FF5E2C] hover:opacity-80'
          }
        `}
      >
        {text}
      </button>
    </Link>
  );
}
