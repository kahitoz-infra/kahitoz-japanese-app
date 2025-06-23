'use client';

import { PlayIcon } from '@heroicons/react/24/solid';

export default function SetBlock({
  setNo,
  status = "not attempted",
  score = null,
  onClick = () => {},
  lastAttempted = null,
}) {
  const statusColors = {
    completed: "bg-green-100 text-green-800 border-green-400",
    attempted: "bg-yellow-100 text-yellow-800 border-yellow-400",
    "not attempted": "bg-gray-100 text-gray-800 border-gray-400",
  };

  const safeStatus = (typeof status === 'string') ? status.toLowerCase() : "not attempted";
  const colorClass = statusColors[safeStatus] || statusColors["not attempted"];

  return (
    <div
      className={`p-4 border rounded-xl shadow-sm ${colorClass} transition-transform duration-200 w-full relative`}
    >
      <h3 className="text-lg font-bold mb-2">Set {setNo}</h3>
      <p className="text-sm font-medium capitalize">Status: {status}</p>

      {safeStatus === 'completed' && (
        <p className="text-sm mt-1 font-semibold">Score: {score}</p>
      )}

      {["attempted", "completed"].includes(safeStatus) && lastAttempted && (
  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
    Last Attempted: {new Date(lastAttempted).toISOString().split('T')[0]}
  </p>
)}


      <div className="mt-4 flex justify-end">
        <button
          onClick={onClick}
          className="w-10 h-10 rounded-full bg-[#FF5274] dark:bg-[#F66538] shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          title="Start Set"
        >
          <PlayIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
