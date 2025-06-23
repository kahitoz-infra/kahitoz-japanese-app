'use client';

export default function SetBlock({ setNo, status, score = null, onClick = () => {} }) {
  const statusColors = {
    completed: "bg-green-100 text-green-800 border-green-400",
    attempted: "bg-yellow-100 text-yellow-800 border-yellow-400",
    "not attempted": "bg-gray-100 text-gray-800 border-gray-400",
  };

  const colorClass = statusColors[status.toLowerCase()] || statusColors["not attempted"];

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 border rounded-xl shadow-sm ${colorClass} hover:scale-[1.03] transition-transform duration-200 w-full`}
    >
      <h3 className="text-lg font-bold mb-2">Set {setNo}</h3>
      <p className="text-sm font-medium capitalize">Status: {status}</p>
      {status.toLowerCase() === 'completed' && (
        <p className="text-sm mt-1 font-semibold">Score: {score}</p>
      )}
    </div>
  );
}
