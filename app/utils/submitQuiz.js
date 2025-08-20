// utils/submitQuiz.js
export async function submitQuiz() {
  try {
    const adaptiveQuiz = JSON.parse(localStorage.getItem("adaptive_quiz"));
    const adaptiveResponses = JSON.parse(localStorage.getItem("adaptive_quiz_responses"));

    if (!adaptiveQuiz || !adaptiveResponses) {
      throw new Error("Missing adaptive_quiz or adaptive_quiz_responses in localStorage");
    }

    const { quiz_id, sets_data } = adaptiveQuiz;

    // Flatten sets into [{ setname, questionIds[] }]
    const sets = Object.entries(sets_data).map(([setname, items]) => ({
      setname,
      questionIds: items.filter(i => i.type === "question").map(i => i._id)
    }));

    // Send each set separately
    for (const set of sets) {
      const responsePayload = {
        quiz_id,
        set_name: set.setname,
        response: adaptiveResponses.responses
          .filter(r => set.questionIds.includes(r.q_id))
          .map(r => ({
            question_id: r.q_id,
            correct: r.correct,
          })),
      };

      const res = await fetch("/api/submitQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responsePayload),
      });

      if (!res.ok) throw new Error(`Failed for ${set.setname}: ${res.statusText}`);
    }

    return { success: true };
  } catch (err) {
    console.error("submitQuiz error:", err);
    throw err;
  }
}
