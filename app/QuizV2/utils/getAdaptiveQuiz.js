// Import your custom authFetch utility
import { authFetch } from "@/app/middleware"; // Adjust the path as necessary

export const getAdaptiveQuiz = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_ADAPT_LEARN;
  const kanjiTarget = 4;
  const vocabTarget = 8;
  const apiUrl = `${baseUrl}/adapt_quiz?kanji_target=${kanjiTarget}&vocab_target=${vocabTarget}`;

  try {
    // Use authFetch instead of the standard fetch
    const response = await authFetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to fetch adaptive quiz:", error);
    throw error;
  }
};

// No changes are needed for the code that calls this function
// or interacts with Local Storage.
(async () => {
  try {
    const quizData = await getAdaptiveQuiz();
    localStorage.setItem('adaptive_quiz', JSON.stringify(quizData));
  } catch (error) {
    console.error("An error occurred while getting and storing the quiz:", error);
  }
})();