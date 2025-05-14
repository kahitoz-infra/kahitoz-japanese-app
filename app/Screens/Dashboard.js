"use client"
import Link from 'next/link';

const Dashboard = () => {
    return (
        <>
            <div className="flex items-center justify-center w-full p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-x-2 gap-y-2 ">

                    {/* JLPT Kanji List */}
                    <div className="flex items-center justify-center">
                        <Link href="/KanjiList" passHref>
                            <div className="bg-red-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl cursor-pointer">
                                Kanji List
                            </div>
                        </Link>
                    </div>

                    {/* JLPT N5 Kanji */}
                    <div className="flex items-center justify-center">
                        <Link href="/KanjiCards" passHref>
                            <div className="bg-red-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl cursor-pointer">
                                Kanji Cards
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Dashboard;