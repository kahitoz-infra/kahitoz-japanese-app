import QuizBlock from "../CustomQuiz/components/QuizBlock";

export default function CustomQuizPage() {
  return (
    <div className="flex flex-col text-black dark:text-white min-h-screen">
      {/* Top Rectangle */}
      <div className="w-full h-[20vh] bg-[#fbfbfb] dark:bg-[#2F2F2F] border-b-4 border-[#FF5274] dark:border-[#F66538] rounded-b-xl px-4 py-2 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-black dark:text-white text-center">
          Zen Kanji Quiz Section
        </h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-black flex items-start justify-center pt-4 pb-6 px-4">
        <QuizBlock />
      </main>
    </div>
  );
}
