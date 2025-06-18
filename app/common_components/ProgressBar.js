'use client';

export default function ProgressBar({ label = "Progress", start = 0, end = 100, current = 0 }) {
  const percentage = Math.min(Math.max(((current - start) / (end - start)) * 100, 0), 100);

  return (
    <div className="w-full items-center mt-4">
      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-300 dark:bg-white rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 bg-[#FF5274] dark:bg-[#F66538] rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Labels below */}
      <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200 mt-1 px-1">
        <span>{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
