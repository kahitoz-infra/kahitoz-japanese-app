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

export function formatQuestion(question, type) {
  if (!question) return <p>Question missing</p>;

  // --- Case: Simple string ---
  if (typeof question === 'string') {
    return (
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
        {question}
      </h2>
    );
  }

  // --- Case: Object ---
  if (typeof question === 'object') {
    // Case 1: kanji_to_onyo_kunyo / kanji_to_onyomi_kunyomi
    if (type === 'kanji_to_onyo_kunyo' || type === 'kanji_to_onyomi_kunyomi') {
      const onyomi = Array.isArray(question.Onyomi)
        ? question.Onyomi.join(', ')
        : JSON.parse(question.Onyomi).join(', ');

      const kunyomi = Array.isArray(question.Kunyomi)
        ? question.Kunyomi.join(', ')
        : JSON.parse(question.Kunyomi).join(', ');

      return (
        <div className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
          <p>
            {question.sentence_1}{' '}
            <span className="font-extrabold">{onyomi}</span>
          </p>
          <p>
            {question.sentence_2}{' '}
            <span className="font-extrabold">{kunyomi}</span>
          </p>
        </div>
      );
    }

// Case 2: Onyomi/Kunyomi → Kanji (your JSON case)
if (type === 'onyo_kunyo_to_kanji' || question.question) {
  // Try direct kanji field
  let kanjiSymbol = question.kanji;

  // If kanji field is just a number, extract from _id instead
  if (!kanjiSymbol || typeof kanjiSymbol === 'number') {
    const match = question._id?.match(/_([^_]+)_N\d+/);
    if (match) {
      kanjiSymbol = match[1]; // The extracted Kanji (e.g., 出)
    }
  }

  return (
    <div className="text-lg md:text-xl font-semibold text-center mb-6 text-black dark:text-white">
      <p>{question.question}</p>
      {kanjiSymbol && (
        <p className="text-3xl font-extrabold mt-2">{kanjiSymbol}</p>
      )}
    </div>
  );
}

    // Case 3: Generic sentences
    if (question.sentence_1 || question.sentence_2) {
      return (
        <div className="text-lg md:text-xl font-semibold text-center mb-6 text-black dark:text-white">
          {question.sentence_1 && <p>{question.sentence_1}</p>}
          {question.sentence_2 && <p>{question.sentence_2}</p>}
        </div>
      );
    }

    // Fallback: debug JSON
    return (
      <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
        {JSON.stringify(question, null, 2)}
      </pre>
    );
  }

  return <p>Invalid question format</p>;
}
