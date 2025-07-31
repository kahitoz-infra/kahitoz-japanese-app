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

  if (typeof question === 'string') {
    return (
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
        {question}
      </h2>
    );
  }

  if (typeof question === 'object') {
    if (type === 'kanji_to_onyo_kunyo' || type === 'kanji_to_onyomi_kunyomi') {
      // ✅ Join arrays to plain text
      const onyomi = Array.isArray(question.Onyomi)
  ? question.Onyomi.join(', ')
  : JSON.parse(question.Onyomi).join(', ');

  const kunyomi = Array.isArray(question.Kunyomi)
  ? question.Kunyomi.join(', ')
  : JSON.parse(question.Kunyomi).join(', ');


      return (
        <div className="text-xl md:text-2xl font-bold text-center mb-6 text-black dark:text-white">
          <p>{question.sentence_1} <span className="font-extrabold">{onyomi}</span></p>
          <p>{question.sentence_2} <span className="font-extrabold">{kunyomi}</span></p>
        </div>
      );
    }

    // Fallback for other question types
    return (
      <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {JSON.stringify(question, null, 2)}
      </pre>
    );
  }

  return <p>Invalid question format</p>;
}
