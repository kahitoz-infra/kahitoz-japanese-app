"use client";
import Link from "next/link";

export default function KanjiTableView({ kanjiList }) {
    return (
        <div className="pt-16 px-4">

            {kanjiList.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-400">
                    <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="border p-2">SNo.</th>
                        <th className="border p-2">Kanji</th>
                        <th className="border p-2">Onyomi</th>
                        <th className="border p-2">Kunyomi</th>
                        <th className="border p-2">Meaning</th>
                    </tr>
                    </thead>
                    <tbody>
                    {kanjiList.map((kanji, idx) => (
                        <tr key={kanji.uid || idx} className="text-center">
                            <td className="border p-1">{idx + 1}</td>
                            <td className="border p-1 font-bold">{kanji.kanji}</td>
                            <td className="border p-1 text-purple-600">{kanji.onyomi}</td>
                            <td className="border p-1 text-purple-600">{kanji.kunyomi}</td>
                            <td className="border p-1">{kanji.english}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No data found</p>
            )}
        </div>
    );
}
