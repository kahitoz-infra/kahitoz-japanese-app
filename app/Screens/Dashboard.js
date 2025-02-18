"use client"
const Dashboard = () => {
    const onClickN5 = () =>{
        window.location.href="/Kanji"
    }
    return (
        <>
            <div className="flex items-center justify-center w-full p-4">


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-x-2 gap-y-2 ">
            
                <div className="flex items-center justify-center">
                        <div className="bg-red-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl cursor-pointer" onClick={() => window.location.assign("/KanjiList")}>
                            JLPT Kanji List

                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="bg-red-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl cursor-pointer" onClick={()=>onClickN5()}>
                            JLPT N5 Kanji

                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="bg-orange-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl">
                            JLPT N4 Kanji

                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="bg-yellow-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl">
                            JLPT N3 Kanji

                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="bg-blue-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl">
                            JLPT N2 Kanji

                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="bg-green-500 p-4 w-64 h-64 flex items-center justify-center rounded-xl font-bold text-xl">
                            JLPT N1 Kanji

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;