// utils/formatOption.js

export const formatOption = (optionStr, type) => {
  if (type === 'onyo_kunyo_to_kanji') {
    try {
      const [onyomiPart, kunyomiPart] = optionStr.split('|');

      const parseAndJoin = (rawStr) => {
        const cleaned = rawStr.replace(/[\[\]"]/g, '').trim();
        return cleaned ? cleaned.split(',').map(s => s.trim()).join(', ') : '—';
      };

      const onyomi = parseAndJoin(onyomiPart);
      const kunyomi = parseAndJoin(kunyomiPart);

      return `Onyomi: ${onyomi} | Kunyomi: ${kunyomi}`;
    } catch {
      return optionStr;
    }
  }

  return optionStr.replace(/[\[\]"\|]/g, '').trim();
};

// utils/formatOption.js

export function formatQuestion(question, type) {
  if (!question) return <p>Question missing</p>;

  // --- Case: String question ---
  if (typeof question === 'string') {
    return (
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
        {question}
      </h2>
    );
  }

  // --- Case: Object question (Corrected) ---
  // The check is changed from 'question.question' to 'question.sentence_1'
  if (typeof question === 'object' && question.sentence_1) {
    // Destructuring directly from 'question' instead of 'question.question'
    const { sentence_1, sentence_2, Onyomi, Kunyomi } = question;

    // Parse Onyomi & Kunyomi safely
    let onyomi = [];
    let kunyomi = [];
    try {
      onyomi = JSON.parse(Onyomi || '[]');
      kunyomi = JSON.parse(Kunyomi || '[]');
    } catch {
      console.warn("Failed to parse Onyomi/Kunyomi", { Onyomi, Kunyomi });
    }

    return (
      <div className="text-xl md:text-2xl font-semibold text-center mb-6 text-black dark:text-white">
        {sentence_1 && (
          <p>
            {sentence_1}
            <span className="font-extrabold text-orange-400">
              {onyomi.join(', ')}
            </span>
          </p>
        )}
        {sentence_2 && (
          <p>
            {sentence_2}
            <span className="font-extrabold text-orange-400">
              {kunyomi.join(', ')}
            </span>
          </p>
        )}
      </div>
    );
  }

  // --- Fallback for debugging ---
  return (
    <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
      {JSON.stringify(question, null, 2)}
    </pre>
  );
}