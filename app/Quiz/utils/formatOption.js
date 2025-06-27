export const formatOption = (optionStr, type) => {
  if (type === 'onyo_kunyo_to_kanji') {
    try {
      const [onyomiRaw, kunyomiRaw] = optionStr.split('|').map(part => JSON.parse(part.trim()));
      const onyomi = onyomiRaw.length ? onyomiRaw.join(', ') : '—';
      const kunyomi = kunyomiRaw.length ? kunyomiRaw.join(', ') : '—';
      return `Onyomi: ${onyomi} | Kunyomi: ${kunyomi}`;
    } catch {
      return optionStr;
    }
  } else if(type === ''){

  }
  return optionStr;
};
