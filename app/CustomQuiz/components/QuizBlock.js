'use client';

export default function CustomKanjiQuizBlock({
  heading = 'Custom Kanji Quiz 1',
  notes = 'N5 All and N4 Selective',
  level = 'N5: All, N4: 1 to 100',
  totalSets = 30,
}) {
  return (
    <div className="rounded-2xl border border-gray-400 p-6 bg-white dark:bg-[#2C2C2C] shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-3">{heading}</h2>
      <div className="text-gray-800 dark:text-gray-200 space-y-2">
        <p><span className="font-semibold">Notes:</span> {notes}</p>
        <p><span className="font-semibold">Level:</span> {level}</p>
        <p><span className="font-semibold">Total Sets:</span> {totalSets}</p>
      </div>
    </div>
  );
}
