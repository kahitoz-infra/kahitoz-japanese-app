'use client';
import Link from 'next/link';

export default function CustomButton({ text, href = '#', disabled = false }) {
  if (!href && !disabled) {
    console.error('CustomButton: href is required when not disabled');
    return null;
  }

  return (
    <Link
      href={disabled ? '#' : href}
      onClick={(e) => disabled && e.preventDefault()}
    >
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
