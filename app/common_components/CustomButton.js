'use client';
import Link from 'next/link';

export default function CustomButton({ text, href = '', disabled = false }) {
  // Fallback to '#' if href is not defined or empty when not disabled
  const safeHref = disabled || !href ? '#' : href;

  return (
    <Link href={safeHref} onClick={(e) => disabled && e.preventDefault()}>
      <button
        disabled={disabled}
        className={`
          px-6 py-3 rounded-xl text-white font-bold transition-colors duration-200
          ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF3A60] dark:bg-[#FF5E2C] hover:opacity-90'}
        `}
      >
        {text}
      </button>
    </Link>
  );
}
